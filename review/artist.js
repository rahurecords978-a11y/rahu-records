import {initializeApp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {getFirestore,doc,setDoc,addDoc,collection,serverTimestamp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {getStorage,ref,uploadBytes} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
import {firebaseConfig} from "./firebase-config.js";
const el=id=>document.getElementById(id),status=msg=>el("status").textContent=msg;
if(!firebaseConfig.apiKey){status("Artist service awaiting Firebase configuration.");}
else{
 const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),storage=getStorage(app);
 el("login").onclick=async()=>{try{await signInWithEmailAndPassword(auth,el("email").value,el("password").value)}catch(e){status(e.message)}};
 el("register").onclick=async()=>{try{await createUserWithEmailAndPassword(auth,el("email").value,el("password").value)}catch(e){status(e.message)}};
 onAuthStateChanged(auth,async user=>{el("application").classList.toggle("hidden",!user);const claims=user?(await user.getIdTokenResult(true)).claims:{};el("upload").classList.toggle("hidden",!claims.artistApproved&&!claims.admin);status(user?"Signed in as "+user.email:"Sign in or register to apply.");});
 el("apply").onclick=async()=>{try{const u=auth.currentUser;if(!u)throw Error("Sign in first");const displayName=el("stageName").value.trim(),bio=el("bio").value.trim();if(!displayName||!bio)throw Error("Enter a stage name and biography.");await setDoc(doc(db,"artists",u.uid),{displayName,bio,approved:false,createdAt:serverTimestamp()});status("Application submitted for administrator review.")}catch(e){status(e.message)}};
 el("send").onclick=async()=>{try{const u=auth.currentUser,claims=(await u.getIdTokenResult(true)).claims;if(!claims.artistApproved&&!claims.admin)throw Error("Approval required.");const file=el("audio").files[0],title=el("title").value.trim();if(!file||!file.type.startsWith("audio/")||!title)throw Error("Choose an audio file and enter a title.");if(file.size>200*1024*1024)throw Error("Maximum file size 200MB.");const id=crypto.randomUUID();const path="artist-uploads/"+u.uid+"/"+id+"/"+file.name.replace(/[^a-z0-9._-]/gi,"_");await uploadBytes(ref(storage,path),file,{contentType:file.type});await addDoc(collection(db,"releases"),{ownerUid:u.uid,title,storagePath:path,published:false,createdAt:serverTimestamp()});status("Uploaded. Awaiting publication review.")}catch(e){status(e.message)}};
}
