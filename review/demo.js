import {initializeApp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {getAuth,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {firebaseConfig,apiBase} from "./firebase-config.js";
const el=id=>document.getElementById(id);let auth;
if(firebaseConfig.apiKey)auth=getAuth(initializeApp(firebaseConfig));else el("status").textContent="Demo service is awaiting secure configuration.";
el("login").onclick=async()=>{try{await signInWithEmailAndPassword(auth,el("email").value,el("password").value);el("status").textContent="Signed in."}catch(e){el("status").textContent=e.message}};
el("submit").onclick=async()=>{try{if(!auth?.currentUser)throw Error("Please sign in first.");const token=await auth.currentUser.getIdToken();const r=await fetch(apiBase+"/free-demo",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({story:el("story").value})});const d=await r.json();if(!r.ok)throw Error(d.error);el("status").textContent="Confirmed: $0. Request reference "+d.requestId;}catch(e){el("status").textContent=e.message}};
