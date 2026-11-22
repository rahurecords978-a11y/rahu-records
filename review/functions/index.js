"use strict";
const {onRequest}=require("firebase-functions/v2/https");
const {defineSecret}=require("firebase-functions/params");
const admin=require("firebase-admin");
const express=require("express");
const Stripe=require("stripe");
admin.initializeApp();
const stripeKey=defineSecret("STRIPE_SECRET_KEY");
const webhookKey=defineSecret("STRIPE_WEBHOOK_SECRET");
const app=express();
const prices={single:9900,five:39599,ten:69995};
const origin=process.env.PUBLIC_SITE_ORIGIN;
app.post("/api/checkout",express.json(),async(req,res)=>{
 try {
  if(!origin) return res.status(503).json({error:"Checkout is not configured"});
  const packageId=String(req.body?.packageId||"");
  if(!Object.hasOwn(prices,packageId)) return res.status(400).json({error:"Invalid package"});
  const stripe=new Stripe(stripeKey.value());
  const session=await stripe.checkout.sessions.create({
   mode:"payment",line_items:[{price_data:{currency:"usd",unit_amount:prices[packageId],product_data:{name:"SPICA custom songs — "+packageId}},quantity:1}],
   success_url:origin+"/?payment=success",cancel_url:origin+"/?payment=cancel",
   metadata:{packageId}
  });
  res.json({url:session.url});
 }catch(e){console.error(e);res.status(500).json({error:"Checkout unavailable"});}
});
app.post("/api/free-demo",express.json(),async(req,res)=>{
 try {
  const auth=req.get("Authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!token) return res.status(401).json({error:"Sign in required"});
  const decoded=await admin.auth().verifyIdToken(token);
  const story=String(req.body?.story||"").trim();
  if(story.length<10||story.length>4000)return res.status(400).json({error:"Story must be 10–4000 characters"});
  const ref=await admin.firestore().collection("demoRequests").add({customerUid:decoded.uid,story,status:"requested",amountCents:0,createdAt:admin.firestore.FieldValue.serverTimestamp()});
  res.status(201).json({requestId:ref.id,amountCents:0,status:"confirmed"});
 }catch(e){res.status(401).json({error:"Authentication failed"});}
});
app.post("/api/stripe-webhook",express.raw({type:"application/json"}),async(req,res)=>{
 try {
  const stripe=new Stripe(stripeKey.value());
  const event=stripe.webhooks.constructEvent(req.body,req.get("stripe-signature"),webhookKey.value());
  if(event.type==="checkout.session.completed"){
   const s=event.data.object;
   await admin.firestore().collection("orders").doc(s.id).set({packageId:s.metadata?.packageId,amountCents:s.amount_total,paymentStatus:s.payment_status,customerEmail:s.customer_details?.email||null,createdAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
  }
  res.json({received:true});
 }catch(e){res.status(400).send("Invalid webhook");}
});

// Administrator-only artist approval and server-side role assignment.
app.post("/api/approve-artist",express.json(),async(req,res)=>{
 try{
  const header=req.get("Authorization")||"";
  if(!header.startsWith("Bearer "))return res.status(401).json({error:"Authentication required"});
  const caller=await admin.auth().verifyIdToken(header.slice(7),true);
  if(caller.admin!==true)return res.status(403).json({error:"Administrator required"});
  const uid=String(req.body?.uid||"");
  if(!/^[A-Za-z0-9_-]{10,128}$/.test(uid))return res.status(400).json({error:"Invalid user"});
  const user=await admin.auth().getUser(uid);
  const claims={...(user.customClaims||{}),artistApproved:true};
  await admin.auth().setCustomUserClaims(uid,claims);
  await admin.firestore().collection("artists").doc(uid).update({approved:true,approvedAt:admin.firestore.FieldValue.serverTimestamp()});
  res.json({approved:true,uid});
 }catch(e){console.error(e);res.status(500).json({error:"Approval failed"});}
});

exports.api=onRequest({secrets:[stripeKey,webhookKey],region:"us-east1"},app);
