// ============================================================
// password.js — あいことば（キャンペーンコード）
//
// Firestore構成:
//   passwords/{passwordId}
//     code            : string（正規化して比較。前後空白トリム＋小文字化）
//     coinAmount      : number
//     startAt         : Timestamp
//     endAt           : Timestamp
//     active          : boolean
//     maxUses         : number（0 or null = 無制限）
//     currentUses     : number
//   passwords/{passwordId}/redemptions/{uid}
//     redeemedAt      : Timestamp
//     （1ユーザー1回のみ使用可能をこのサブコレクションのドキュメント存在で担保）
//
// ★セキュリティ上の注意（README.mdにも記載）:
//   Cloud Functionsを使わないクライアント完結構成のため、あいことばの正誤判定を
//   クライアント側のFirestore読み取りで行っている。Firestoreルールで
//   passwords コレクションの一覧取得(list)は禁止し、コード文字列に完全一致する
//   ドキュメントのみ get できるようにすることを推奨する（詳細はfirestore.rules）。
//   より厳密に守りたい場合はCloud Functions化を推奨。
// ============================================================
import {
  db, doc, getDocs, setDoc, updateDoc, deleteDoc, addDoc,
  collection, query, where, onSnapshot, runTransaction,
  serverTimestamp, increment,
} from './firebase.js';

function normalizeCode(code){
  return (code || '').trim().toLowerCase();
}

/**
 * あいことばを引き換える。
 * @returns {Promise<{success:boolean, coinAmount?:number, message:string}>}
 */
export async function redeemPassword(uid, rawCode){
  const code = normalizeCode(rawCode);
  if(!code) return { success:false, message:'あいことばを入力してください' };

  const q = query(collection(db, 'passwords'), where('code', '==', code));
  const results = await getDocs(q);

  if(results.empty){
    return { success:false, message:'そのあいことばは見つかりませんでした' };
  }

  const passwordDoc = results.docs[0];
  const passwordRef = doc(db, 'passwords', passwordDoc.id);
  const redemptionRef = doc(db, 'passwords', passwordDoc.id, 'redemptions', uid);

  try{
    const coinAmount = await runTransaction(db, async (tx)=>{
      const pSnap = await tx.get(passwordRef);
      if(!pSnap.exists()) throw new Error('あいことばが見つかりません');
      const p = pSnap.data();

      if(!p.active) throw new Error('このあいことばは現在無効です');

      const now = Date.now();
      if(p.startAt && now < p.startAt.toMillis()) throw new Error('まだ利用開始前です');
      if(p.endAt && now > p.endAt.toMillis()) throw new Error('利用期限が終了しています');
      if(p.maxUses && p.maxUses > 0 && (p.currentUses||0) >= p.maxUses){
        throw new Error('利用回数の上限に達しました');
      }

      const rSnap = await tx.get(redemptionRef);
      if(rSnap.exists()) throw new Error('このあいことばは既に使用済みです');

      tx.set(redemptionRef, { redeemedAt: serverTimestamp() });
      tx.update(passwordRef, { currentUses: increment(1) });

      return p.coinAmount || 0;
    });

    return { success:true, coinAmount, message:`${coinAmount}コインを獲得しました！` };
  }catch(err){
    return { success:false, message: err.message || '引き換えに失敗しました' };
  }
}

// ------------------------------------------------------------
// 管理者向け CRUD
// ------------------------------------------------------------

export function subscribePasswordList(callback){
  return onSnapshot(collection(db, 'passwords'), (snap)=>{
    const list = [];
    snap.forEach(d=>list.push({ id:d.id, ...d.data() }));
    callback(list);
  });
}

export async function createPassword(data){
  await addDoc(collection(db, 'passwords'), {
    code: normalizeCode(data.code),
    coinAmount: Number(data.coinAmount) || 0,
    startAt: data.startAt,
    endAt: data.endAt,
    active: !!data.active,
    maxUses: Number(data.maxUses) || 0,
    currentUses: 0,
  });
}

export async function updatePassword(id, data){
  const payload = { ...data };
  if(payload.code) payload.code = normalizeCode(payload.code);
  if(payload.coinAmount !== undefined) payload.coinAmount = Number(payload.coinAmount);
  if(payload.maxUses !== undefined) payload.maxUses = Number(payload.maxUses);
  await updateDoc(doc(db, 'passwords', id), payload);
}

export async function deletePassword(id){
  await deleteDoc(doc(db, 'passwords', id));
}
