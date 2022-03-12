import Razorpay from 'razorpay';

export async function post({request}) {

  const body = await request.json();
  var amt =body.totalPrice * 100 > 4000000 ? 4000000 : body.totalPrice * 100;
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

      const order = await instance.orders.create({
        amount: amt,
        currency: "INR",
        })
    
      var options = {
        "key": process.env.RAZORPAY_KEY, 
        "amount": amt,
        "currency": "INR",
        "name": "Payment",
        "description": "You are paying for your product.",
        "order_id": order.id
      };
    } catch (error) {
      console.error(error);
  }
  return {body: options, status: 200}
}