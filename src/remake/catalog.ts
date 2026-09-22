export const rooms=[
{id:0,key:'reception',name:'受渡口',at:[0,0]},
{id:1,key:'office',name:'帳場',at:[1,0]},
{id:2,key:'proof',name:'校正室',at:[0,-1]},
{id:3,key:'type',name:'活字室',at:[0,-2]},
{id:4,key:'press',name:'印刷室',at:[1,-2]},
{id:5,key:'binding',name:'製本室',at:[-1,-2]},
{id:6,key:'archive-east',name:'東書庫',at:[0,-3]},
{id:7,key:'archive-west',name:'西書庫',at:[-1,-3]},
{id:8,key:'repair',name:'修復室',at:[1,-3]},
{id:9,key:'vault',name:'原型庫',at:[1,-4]},
{id:10,key:'loading',name:'搬出間',at:[-1,0]},
] as const;
export const directions=['north','east','south','west'] as const;
export type Portal={from:number;facing:0|1|2|3;to:number;gate?:'loading'|'office'|'workshop'|'archive'|'shelves'|'secret';rect:[number,number,number,number]};
export const portals:Portal[]=[
{from:0,facing:0,to:2,rect:[72,16,20,59]}, {from:2,facing:2,to:0,rect:[14,17,16,58]},
{from:0,facing:1,to:1,gate:'office',rect:[38,15,20,64]}, {from:1,facing:3,to:0,rect:[38,15,24,65]},
{from:0,facing:3,to:10,gate:'loading',rect:[17,18,21,65]}, {from:10,facing:1,to:0,gate:'loading',rect:[62,15,25,65]},
{from:2,facing:0,to:3,gate:'workshop',rect:[20,18,18,58]}, {from:3,facing:2,to:2,rect:[14,16,19,61]},
{from:3,facing:1,to:4,rect:[20,18,28,59]}, {from:4,facing:3,to:3,rect:[31.7,22.1,36.2,58]},
{from:3,facing:3,to:5,rect:[73,17,15,59]}, {from:5,facing:1,to:3,rect:[31.6,18,25.6,58.3]},
{from:3,facing:0,to:6,gate:'archive',rect:[38,15,24,65]}, {from:6,facing:2,to:3,rect:[38,15,24,65]},
{from:6,facing:3,to:7,rect:[38,15,24,65]}, {from:7,facing:1,to:6,rect:[38,15,24,65]},
{from:6,facing:1,to:8,gate:'shelves',rect:[38,15,24,65]}, {from:8,facing:3,to:6,gate:'shelves',rect:[38,15,24,65]},
{from:8,facing:0,to:9,gate:'secret',rect:[38,15,24,65]}, {from:9,facing:2,to:8,rect:[38,15,24,65]},
];
export const itemNames={key:'真鍮の鍵',card:'丸印の札','card-diamond':'菱形の札','card-moon':'三日月の札',cards:'二枚の返却札',receipts:'三枚の複写控え',folios:'両面の校正紙',knife:'紙ナイフ',lens:'拡大鏡',register:'紙の位置決め片',weights:'刷り機の押さえ',corner:'金属の角当て',threadchart:'綴じ糸の見本',plates:'原版',pin:'紙止めのピン',proof:'試し刷りの紙',needle:'綴じ針',thread:'綴じ糸',oldplan:'旧書庫の見取り図',gatherings:'紙の束',tissue:'薄い保護紙',blanks:'白紙の束',wedge:'斜面の木片',cradle:'小口の支持具',frame:'綴じ枠',returnrecord:'返却の記録',keyparts:'六枚歯の保守鍵',clamp:'束の締め具'} as const;
export type CampaignItem=keyof typeof itemNames;
export type Mechanism='layers'|'digits'|'receipts'|'rings'|'measure'|'paper-face'|'folios'|'balance'|'seals'|'plates'|'loops'|'press'|'thread'|'scraps'|'latches'|'shelves'|'watermarks'|'envelope'|'books'|'mirrors'|'assemble'|'foreedge'|'blanks'|'frame'|'rubbing'|'pins'|'cams'|'masters'|'bind';
export type ObjectSpec={id:number;name:string;room:number;facing:0|1|2|3;kind:Mechanism;rect:[number,number,number,number];physical:CampaignItem[];rewards:CampaignItem[];box:boolean};
const o=(id:number,name:string,room:number,facing:0|1|2|3,kind:Mechanism,rect:[number,number,number,number],physical:CampaignItem[]=[],rewards:CampaignItem[]=[],box=true):ObjectSpec=>({id,name,room,facing,kind,rect,physical,rewards,box});
// Rectangles are calibrated against accepted photographs before scene activation.
export const objects:ObjectSpec[]=[
o(1,'札入れ',0,2,'layers',[15.15,24.3,12.6,20.8],[],['card-diamond','card-moon'],false),
o(2,'帳場の引出し',1,1,'digits',[32,62,40,10],[],['receipts']),
o(3,'校正箱',1,0,'receipts',[35,52,30,29],[],['folios']),
o(4,'工具箱',2,0,'rings',[69,50,12,8],[],['knife','lens']),
o(5,'欠けた定規',2,1,'measure',[36,53,32,6],['knife'],['register'],false),
o(6,'試し刷り',2,3,'paper-face',[31,54,37,7],[],[],false),
o(7,'工房戸',2,0,'folios',[20,18,18,58],[],[]),
o(8,'釣合いの箱',3,1,'balance',[60,26,28,55],[],['weights']),
o(9,'封印の箱',5,3,'seals',[22,46,50,32],[],['corner','threadchart']),
o(10,'原版の引出し',3,3,'plates',[23,46,50,32],[],['plates']),
o(11,'留め輪',4,2,'loops',[27.5,45,17,15],[],['pin']),
o(12,'校正刷り機',4,0,'press',[23,21,51,65],['plates','pin','weights','register'],['proof'],false),
o(13,'綴じ見本',5,0,'thread',[29,48,45,15],[],['needle','thread'],false),
o(14,'断裁片',5,2,'scraps',[25,42,50,33],['corner'],['oldplan'],false),
o(15,'書庫の保守戸',3,0,'latches',[38,15,24,65],[],[]),
o(16,'可動書架',6,1,'shelves',[12,18,76,65],[],[],false),
o(17,'透かしの束',7,0,'watermarks',[22,44,50,32],[],['gatherings'],false),
o(18,'封筒',6,0,'envelope',[28,47,43,25],['knife'],['tissue','blanks']),
o(19,'重さの違う本',7,3,'books',[23,44,53,32],[],['wedge']),
o(20,'見本台の灯り',8,2,'mirrors',[20,32,54,44],[],[],false),
o(21,'角当ての台',8,1,'assemble',[20,46,54,29],['corner','wedge'],['cradle'],false),
o(22,'小口の見本',8,2,'foreedge',[25,51,50,27],['gatherings','cradle'],[],false),
o(23,'白紙の位置',9,3,'blanks',[24,42,50,33],['blanks'],[],false),
o(24,'四片の組み枠',9,1,'frame',[24,45,50,29],[],['frame','returnrecord']),
o(25,'原型の写し',9,0,'rubbing',[18,49,29,26],['tissue'],[],false),
o(26,'鍵部品のケース',1,1,'digits',[61,49,12,12],[],['keyparts']),
o(27,'断面の錠',9,0,'pins',[52,26,31,34],[],[],false),
o(28,'束の締め具',5,1,'cams',[65,47,25,31],['frame'],['clamp'],false),
o(29,'二つの原型',10,0,'masters',[25,44,51,33],[],[],false),
o(30,'閉じた本',10,3,'bind',[73,39,25,45],['gatherings','blanks','needle','thread','frame','clamp','keyparts'],[],false),
];
export const objectById=(id:number)=>objects.find(o=>o.id===id);
