// ============================================================
// title.js — 称号の定義
//
// 称号は「実績を解除すると獲得」する仕様のため、実体は achievement.js の
// ACHIEVEMENTS 配列に titleReward として紐付けている。
// ここでは称号ID→表示名の対応表と、称号なし状態の扱いのみを持つ（単一責務）。
//
// 【拡張方法】新しい称号を追加したい場合：
//   1. ここに { id, name } を追加
//   2. achievement.js の該当実績に titleReward: '<id>' を設定
// これだけで自動的にプロフィール画面・ランキングに反映される。
// ============================================================

export const TITLES = [
  { id: 'none',        name: '称号なし' },
  { id: 'beginner',     name: '初心者' },
  { id: 'adventurer',   name: '冒険者' },
  { id: 'lucky_cat',    name: '幸運の猫' },
  { id: 'lucky_master', name: 'ラッキーマスター' },
  { id: 'bonus_king',   name: 'ボーナス王' },
  { id: 'slot_master',  name: 'スロット名人' },
  { id: 'legend',       name: '伝説の冒険者' },
  { id: 'god',          name: '神' },
];

const TITLE_MAP = Object.fromEntries(TITLES.map(t=>[t.id, t.name]));

export function getTitleName(id){
  return TITLE_MAP[id] || '称号なし';
}

/** プロフィール編集画面用：解除状況込みの一覧を返す（未解除は？？？表示） */
export function getTitleListForDisplay(unlockedTitles){
  return TITLES.map(t=>({
    id: t.id,
    name: (t.id === 'none' || unlockedTitles.includes(t.id)) ? t.name : '？？？',
    unlocked: t.id === 'none' || unlockedTitles.includes(t.id),
  }));
}
