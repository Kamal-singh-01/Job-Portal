// server/controllers/webhook.js
import { Webhook } from 'svix'
import User from '../models/user.js'

export const clerkWebhook = async (req, res) => {
  console.log('🚀 WEBHOOK CALLED - Starting webhook processing');
  console.log(' Request method:', req.method);
  console.log('📥 Request URL:', req.url);
  console.log('📥 Headers:', req.headers);
  
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET
    if (!secret) {
      console.error('❌ Missing CLERK_WEBHOOK_SECRET')
      return res.status(500).json({ success: false })
    }

    console.log('✅ Webhook secret found');

    // req.body is a Buffer because of express.raw()
    const payload = req.body.toString('utf8')
    console.log('📦 Raw payload length:', payload.length);
    console.log('📦 Raw payload preview:', payload.substring(0, 200));

    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    }

    console.log('🔐 Webhook headers:', headers);

    // Verify signature
    const wh = new Webhook(secret)
    wh.verify(payload, headers)
    console.log('✅ Signature verified');

    // Parse event AFTER verification
    const event = JSON.parse(payload)
    const { type, data } = event

    console.log('👉 Clerk event type:', type)
    console.log(' Full webhook data:', JSON.stringify(data, null, 2));

    if (type === 'user.created' || type === 'user.updated') {
      const email = data?.email_addresses?.[0]?.email_address || 'no-email@example.com'
      
      // Try different ways to get the name from Clerk data
      let name = 'Anonymous';
      if (data?.first_name && data?.last_name) {
        name = `${data.first_name} ${data.last_name}`.trim();
      } else if (data?.first_name) {
        name = data.first_name;
      } else if (data?.last_name) {
        name = data.last_name;
      } else if (data?.username) {
        name = data.username;
      } else if (data?.full_name) {
        name = data.full_name;
      }
      
      const image = data?.image_url || data?.profile_image_url || ''
      
      console.log('📝 Extracted data:', { id: data.id, email, name, image });

      // Upsert by Clerk user id
      const result = await User.findByIdAndUpdate(
        data.id,
        { _id: data.id, email, name, image, resume: '' },
        { upsert: true, new: true }
      )

      console.log('✅ User upserted in Mongo:', { id: data.id, email, name })
      console.log(' MongoDB result:', result);
      return res.status(200).json({ success: true })
    }

    if (type === 'user.deleted') {
      await User.findByIdAndDelete(data.id)
      console.log('✅ User deleted from Mongo:', data.id)
      return res.status(200).json({ success: true })
    }

    console.log('ℹ️ Unhandled event type:', type)
    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('❌ Clerk webhook error:', err.message)
    console.error('❌ Full error:', err);
    return res.status(400).json({ success: false, message: 'Webhook Error' })
  }
}
