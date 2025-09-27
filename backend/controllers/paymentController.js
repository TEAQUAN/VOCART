const paystack = require('paystack')('your-paystack-secret-key');

exports.makePayment = async (req, res) => {
  const { amount, email } = req.body; // Example: Get payment details from request

  try {
    const response = await paystack.transaction.initialize({
      amount: amount * 100, // Amount should be in kobo (1 Naira = 100 kobo)
      email: email,
      callback_url: 'http://localhost:5000/payment/callback',
    });

    res.status(200).json({ authorization_url: response.data.authorization_url });
  } catch (error) {
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};
