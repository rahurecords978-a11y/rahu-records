import {initializeApp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {getFirestore,collection,query,where,getDocs,doc,updateDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";
const el=id=>document.getElementById(id),status=msg=>el("status").textContent=msg;
if(!firebaseConfig.apiKey)status("Studio awaiting Firebase configuration.");
else{
 const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
 el("login").onclick=async()=>{try{await signInWithEmailAndPassword(auth,el("email").value,el("password").value)}catch(e){status(e.message)}};
 onAuthStateChanged(auth,async user=>{
  const claims=user?(await user.getIdTokenResult(true)).claims:{};
  const allowed=claims.admin===true;el("dashboard").classList.toggle("hidden",!allowed);el("loginPanel").classList.toggle("hidden",allowed);
  if(!allowed){status("Administrator authorization required.");return;}
  status("Authorized administrator.");await load();
 });
 async function load(){
  for(const [name,field] of [["artists","approved"],["releases","published"]]){
   const root=el(name);root.replaceChildren();
   const docs=await getDocs(query(collection(db,name),where(field,"==",false)));
   docs.forEach(s=>{const d=s.data(),article=document.createElement("article"),title=document.createElement("strong"),button=document.createElement("button");title.textContent=d.displayName||d.title||s.id;button.textContent=name==="artists"?"Approve artist profile":"Publish release";
    button.onclick=async()=>{try{await updateDoc(doc(db,name,s.id),{[field]:true});status("Updated. Artist upload permission requires a separate trusted custom-claim assignment.");await load()}catch(e){status(e.message)}};
    article.append(title,button);root.append(article);
   });
  }
 }
}
