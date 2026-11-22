import {initializeApp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {getFirestore,collection,query,where,getDocs} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {firebaseConfig,apiBase} from "./firebase-config.js";
const el=id=>document.getElementById(id);
const ready=!!firebaseConfig.apiKey&&!!firebaseConfig.projectId;
if(!ready){if(el("authStatus"))el("authStatus").textContent="Account services will activate after Firebase configuration.";if(el("checkoutStatus"))el("checkoutStatus").textContent="Checkout is not yet configured.";}
if(ready){
 const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
 const status=msg=>{if(el("authStatus"))el("authStatus").textContent=msg;};
 el("signIn")?.addEventListener("click",async()=>{try{await signInWithEmailAndPassword(auth,el("email").value,el("password").value)}catch(e){status(e.message)}});
 el("signUp")?.addEventListener("click",async()=>{try{await createUserWithEmailAndPassword(auth,el("email").value,el("password").value)}catch(e){status(e.message)}});
 el("signOut")?.addEventListener("click",()=>signOut(auth));
 onAuthStateChanged(auth,async user=>{
  el("memberPanel")?.classList.toggle("hidden",!user);
  el("signOut")?.classList.toggle("hidden",!user);
  if(el("memberIdentity"))el("memberIdentity").textContent=user?.email||"";
  if(user){const claims=(await user.getIdTokenResult()).claims;el("adminLink")?.classList.toggle("hidden",claims.admin!==true);status("Signed in");}else{el("adminLink")?.classList.add("hidden");status("Sign in to access your account");}
 });
 const safe=(tag,text)=>{const e=document.createElement(tag);e.textContent=String(text||"");return e;};
 for(const [collectionName,containerId,filter] of [["artists","liveArtists","approved"],["releases","liveReleases","published"]]){
  try{
   const results=await getDocs(query(collection(db,collectionName),where(filter,"==",true)));
   const root=el(containerId);if(!root)continue;
   results.forEach(doc=>{const d=doc.data(),card=document.createElement("article");card.className="card";card.append(safe("h3",d.displayName||d.title||"Release"),safe("p",d.bio||d.description||""));
    if(collectionName==="releases"&&typeof d.mediaUrl==="string"&&d.mediaUrl.startsWith("https://")){const audio=document.createElement("audio");audio.controls=true;audio.preload="none";audio.src=d.mediaUrl;card.append(audio);}
    root.append(card);
   });
  }catch(e){console.warn("Catalog unavailable",e);}
 }
}
el("checkoutButton")?.addEventListener("click",async()=>{
 const status=el("checkoutStatus");status.textContent="Preparing checkout…";
 try{
  const amount=el("package").value;
  const packageId=({"99":"single","395.99":"five","699.95":"ten"})[amount];
  const response=await fetch(apiBase+"/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({packageId})});
  const result=await response.json();if(!response.ok||!result.url)throw Error(result.error||"Checkout unavailable");
  location.assign(result.url);
 }catch(e){status.textContent=e.message;}
});
