import { MuscleInfo, MuscleStrainInfo, Exercise, SolutionRoutine } from '../types';

export const MUSCLES_LIST: MuscleInfo[] = [
  {
    id: 'upper_trapezius',
    name: '斜方肌上束',
    englishName: 'Upper Trapezius',
    category: 'head_neck',
    categoryName: '肩颈区域',
    view: 'both',
    svgPathId: 'muscle_upper_trapezius',
    description: '位于颈后部及背部上方两侧，连接头颅底部、颈椎与肩膀。主要负责耸肩、头部后仰及向同侧倾斜。',
    locationText: '颈部后侧延伸至双肩膀上缘'
  },
  {
    id: 'levator_scapulae',
    name: '肩胛提肌',
    englishName: 'Levator Scapulae',
    category: 'head_neck',
    categoryName: '肩颈区域',
    view: 'back',
    svgPathId: 'muscle_levator_scapulae',
    description: '深层肌肉，连接上颈椎与肩胛骨上角。主要负责提拉肩胛骨以及协助头部侧屈和旋转。',
    locationText: '颈椎两侧深层连接至肩胛骨内上角'
  },
  {
    id: 'sternocleidomastoid',
    name: '胸锁乳突肌',
    englishName: 'Sternocleidomastoid',
    category: 'head_neck',
    categoryName: '肩颈区域',
    view: 'front',
    svgPathId: 'muscle_sternocleidomastoid',
    description: '位于颈部两侧的粗大肌肉，连接耳后乳突与胸骨、锁骨。负责头部旋转、倾斜及低头。',
    locationText: '颈部前侧斜向延伸（耳后至胸锁骨）'
  },
  {
    id: 'rhomboids',
    name: '菱形肌',
    englishName: 'Rhomboids',
    category: 'back',
    categoryName: '上背区域',
    view: 'back',
    svgPathId: 'muscle_rhomboids',
    description: '位于上背部两块肩胛骨与脊椎之间，形状如菱形。负责将肩胛骨向脊柱靠拢（后收）并保持稳定。',
    locationText: '上背部两肩胛骨内侧缘与脊柱之间'
  },
  {
    id: 'middle_lower_trapezius',
    name: '斜方肌中下束',
    englishName: 'Middle & Lower Trapezius',
    category: 'back',
    categoryName: '上背区域',
    view: 'back',
    svgPathId: 'muscle_middle_lower_trapezius',
    description: '位于中上背部，负责下拉肩胛骨及稳定上背部姿势，对抗圆肩驼背。',
    locationText: '中背部大面积扇形区域延伸至下胸椎'
  },
  {
    id: 'supraspinatus',
    name: '冈上肌',
    englishName: 'Supraspinatus',
    category: 'shoulder',
    categoryName: '肩部区域',
    view: 'back',
    svgPathId: 'muscle_supraspinatus',
    description: '肩袖肌群之一，位于肩胛骨冈上窝内，负责手臂外展起始动作及稳定肩关节。',
    locationText: '肩胛骨上方凹窝内'
  },
  {
    id: 'infraspinatus_teres_minor',
    name: '冈下肌/小圆肌',
    englishName: 'Infraspinatus & Teres Minor',
    category: 'shoulder',
    categoryName: '肩部区域',
    view: 'back',
    svgPathId: 'muscle_infraspinatus_teres_minor',
    description: '肩袖肌群重要组成，位于肩胛骨后下方，负责手臂外旋与肩关节后方稳定。',
    locationText: '肩胛骨背侧中下部及外侧缘'
  },
  {
    id: 'pectoralis_major',
    name: '胸大肌',
    englishName: 'Pectoralis Major',
    category: 'chest',
    categoryName: '胸部区域',
    view: 'front',
    svgPathId: 'muscle_pectoralis_major',
    description: '胸前部大块扇形肌肉，连接胸骨、锁骨与大臂。负责手臂内收、内旋及前屈。',
    locationText: '胸部前上方大面积区域'
  },
  {
    id: 'pectoralis_minor',
    name: '胸小肌',
    englishName: 'Pectoralis Minor',
    category: 'chest',
    categoryName: '胸部区域',
    view: 'front',
    svgPathId: 'muscle_pectoralis_minor',
    description: '胸大肌深层的较小肌肉，连接第3-5肋骨与肩胛骨喙突。紧绷时易导致肩胛骨前倾（圆肩）。',
    locationText: '胸部上方深层（锁骨下方与肋骨之间）'
  },
  {
    id: 'erector_spinae',
    name: '竖脊肌',
    englishName: 'Erector Spinae',
    category: 'lumbar',
    categoryName: '腰背区域',
    view: 'back',
    svgPathId: 'muscle_erector_spinae',
    description: '沿脊柱两侧纵向分布的强大肌肉群，负责维持脊柱直立、后伸及侧屈。',
    locationText: '脊柱两侧自颈部一直延伸至骶骨'
  },
  {
    id: 'quadratus_lumborum',
    name: '腰方肌',
    englishName: 'Quadratus Lumborum',
    category: 'lumbar',
    categoryName: '腰背区域',
    view: 'back',
    svgPathId: 'muscle_quadratus_lumborum',
    description: '深层腰部肌肉，连接第12肋骨、腰椎与髂嵴（骨盆）。负责腰部侧弯及固定骨盆。',
    locationText: '下腰部两侧深层（髂嵴与最下肋骨之间）'
  },
  {
    id: 'multifidus',
    name: '多裂肌',
    englishName: 'Multifidus',
    category: 'lumbar',
    categoryName: '腰背区域',
    view: 'back',
    svgPathId: 'muscle_multifidus',
    description: '紧贴脊椎椎板两侧的深层核心肌肉，负责脊椎微观稳定及椎骨间姿势微调。',
    locationText: '沿脊柱全长紧贴脊椎骨深层'
  },
  {
    id: 'wrist_extensors',
    name: '腕伸肌群',
    englishName: 'Wrist Extensors',
    category: 'arm_hand',
    categoryName: '手臂与手腕',
    view: 'front',
    svgPathId: 'muscle_wrist_extensors',
    description: '位于前臂背面及外侧，负责手腕向上抬起（背伸）及手指伸展。打字和握鼠标时高频收缩。',
    locationText: '前臂背侧（手背同侧）'
  },
  {
    id: 'wrist_flexors',
    name: '腕屈肌群',
    englishName: 'Wrist Flexors',
    category: 'arm_hand',
    categoryName: '手臂与手腕',
    view: 'front',
    svgPathId: 'muscle_wrist_flexors',
    description: '位于前臂掌侧，负责手腕向下弯曲（掌屈）及握拳，长期托握鼠标易紧张。',
    locationText: '前臂掌侧（手掌同侧）'
  },
  {
    id: 'intrinsic_hand',
    name: '手部内在肌',
    englishName: 'Intrinsic Hand Muscles',
    category: 'arm_hand',
    categoryName: '手臂与手腕',
    view: 'front',
    svgPathId: 'muscle_intrinsic_hand',
    description: '包含大鱼际、小鱼际及骨间肌等，控制手指精细敲击键盘、点击鼠标及捏握动作。',
    locationText: '手掌及手指骨间区域'
  },
  {
    id: 'gluteus_maximus',
    name: '臀大肌',
    englishName: 'Gluteus Maximus',
    category: 'hip',
    categoryName: '臀部区域',
    view: 'back',
    svgPathId: 'muscle_gluteus_maximus',
    description: '人体面积最大、最厚实肌肉之一，久坐时处于持续被拉长压迫状态，易发生“臀肌失忆”。',
    locationText: '臀部后侧大面积肌肉区域'
  },
  {
    id: 'gluteus_medius',
    name: '臀中肌',
    englishName: 'Gluteus Medius',
    category: 'hip',
    categoryName: '臀部区域',
    view: 'both',
    svgPathId: 'muscle_gluteus_medius',
    description: '位于臀部外上方，负责髋关节外展及维持站立/单腿支撑时骨盆水平平衡。',
    locationText: '臀部外侧上方（骨盆两侧）'
  },
  {
    id: 'piriformis',
    name: '梨状肌',
    englishName: 'Piriformis',
    category: 'hip',
    categoryName: '臀部区域',
    view: 'back',
    svgPathId: 'muscle_piriformis',
    description: '深层臀部斜行小肌肉，坐姿翘二郎腿或长期久坐会导致其卡压下方走行的坐骨神经。',
    locationText: '臀部深层（骶骨至股骨大转子）'
  },
  {
    id: 'quadriceps',
    name: '股四头肌',
    englishName: 'Quadriceps',
    category: 'leg',
    categoryName: '腿部区域',
    view: 'front',
    svgPathId: 'muscle_quadriceps',
    description: '大腿前侧四大肌肉组合，负责伸膝与屈髋。久坐时髋屈肌群持续缩短紧绷。',
    locationText: '大腿前侧大面积区域'
  },
  {
    id: 'hamstrings',
    name: '腘绳肌',
    englishName: 'Hamstrings',
    category: 'leg',
    categoryName: '腿部区域',
    view: 'back',
    svgPathId: 'muscle_hamstrings',
    description: '大腿后侧肌群（股二头肌、半腱肌、半膜肌），屈膝受压易僵硬，牵拉骨盆后倾。',
    locationText: '大腿后侧（臀线至膝盖弯）'
  },
  {
    id: 'gastrocnemius_soleus',
    name: '腓肠肌/比目鱼肌',
    englishName: 'Gastrocnemius & Soleus',
    category: 'leg',
    categoryName: '腿部区域',
    view: 'back',
    svgPathId: 'muscle_gastrocnemius_soleus',
    description: '小腿后侧双子肌，长期下肢下垂坐姿导致血液循环减缓、小腿肿胀及跟腱紧绷。',
    locationText: '小腿肚后侧区域'
  },
  {
    id: 'tibialis_anterior',
    name: '胫骨前肌',
    englishName: 'Tibialis Anterior',
    category: 'leg',
    categoryName: '腿部区域',
    view: 'front',
    svgPathId: 'muscle_tibialis_anterior',
    description: '位于小腿前外侧，负责勾脚尖（背屈）。习惯翘脚或坐姿脚尖着地时易疲劳。',
    locationText: '小腿前外侧紧贴胫骨骨干'
  }
];

export const MUSCLE_STRAINS: Record<string, MuscleStrainInfo> = {
  upper_trapezius: {
    muscleId: 'upper_trapezius',
    causes: ['长时间低头看手机或笔记本', '久坐伏案悬空双手', '工作压力大导致无意识习惯性耸肩'],
    symptoms: ['肩颈酸胀疼痛', '脖子僵硬转头不顺', '常感肩膀沉重如扛重物', '偶尔引发后脑勺紧张性头痛'],
    severityTip: '建议每45分钟做一次肩部下沉与颈部侧向拉伸，避免双手悬空操作键盘。'
  },
  levator_scapulae: {
    muscleId: 'levator_scapulae',
    causes: ['侧头用耳朵夹电话', '单肩背重包', '电脑屏幕偏向一侧'],
    symptoms: ['落枕感', '转头看后方时颈角刺痛', '肩胛骨内上角有明显压痛点'],
    severityTip: '做转头拉伸时将同侧手放在椅面上固定肩膀，能更精准放松此肌肉。'
  },
  sternocleidomastoid: {
    muscleId: 'sternocleidomastoid',
    causes: ['前倾伸脖子看屏幕（龟颈姿势）', '高枕睡眠', '长时间低头打字'],
    symptoms: ['脖子前侧僵硬', '偶尔伴随眼眶周围胀痛', '转头时前颈抽痛', '耳鸣或头晕感'],
    severityTip: '注意调整显示器高度至眼睛平视前方，做仰头微转动作放松前颈。'
  },
  rhomboids: {
    muscleId: 'rhomboids',
    causes: ['长久含胸驼背打字', '双手前伸无支撑操作鼠标', '缺乏上背伸展'],
    symptoms: ['两肩胛骨中间（上背部）持续隐痛', '呼吸时觉得背部紧绷', '按压有酸麻点'],
    severityTip: '搭配扩胸与抱着办公椅靠背向前弯腰拉伸，能快速缓解背部紧绷。'
  },
  middle_lower_trapezius: {
    muscleId: 'middle_lower_trapezius',
    causes: ['瘫坐办公', '双手前伸伏案', '中背肌力不足'],
    symptoms: ['中背部酸软乏力', '长时间坐立难以直腰', '容易疲劳呈驼背姿势'],
    severityTip: '通过靠墙W字收缩动作激活下斜方肌，改善站立与坐姿体态。'
  },
  supraspinatus: {
    muscleId: 'supraspinatus',
    causes: ['手肘悬空抬手臂操作鼠标', '高桌低椅导致抬臂过高', '频繁抬臂拿取高处文件'],
    symptoms: ['抬手臂至特定角度时肩顶刺痛', '肩膀关节嘎吱响', '肩部外侧隐痛'],
    severityTip: '办公时确保手臂在椅手柄或桌面上获得完整支撑，减轻肩关节压迫。'
  },
  infraspinatus_teres_minor: {
    muscleId: 'infraspinatus_teres_minor',
    causes: ['长时间保持双手内旋打字状态', '双手向前抱臂或耸肩膀'],
    symptoms: ['肩膀后方深层酸痛', '睡觉侧卧压迫肩后部不适', '伸手向后扣内衣或摸后背吃力'],
    severityTip: '利用办公桌边缘进行手臂外旋拉伸，恢复肩关节正常活动度。'
  },
  pectoralis_major: {
    muscleId: 'pectoralis_major',
    causes: ['长时间双手向前打字', '圆肩前倾体态', '姿势固化导致胸肌缩短'],
    symptoms: ['胸前部紧绷压迫感', '难以大口深呼吸扩展胸廓', '转动肩膀时胸前酸拉'],
    severityTip: '利用办公室门口或墙角做门框胸肌拉伸，迅速打开紧缩的胸部。'
  },
  pectoralis_minor: {
    muscleId: 'pectoralis_minor',
    causes: ['双手向前弯腰伏案', '打字时肩胛骨前倾锁定', '缺乏反向伸展'],
    symptoms: ['锁骨下方深层压痛', '引发手麻或手臂内侧麻木感', '严重的圆肩体态'],
    severityTip: '胸小肌紧绷容易压迫臂丛神经，务必定期做双手后扣扩胸放松。'
  },
  erector_spinae: {
    muscleId: 'erector_spinae',
    causes: ['久坐且椅背无腰托', '向前弯腰看屏幕', '弯腰搬重物姿势不当'],
    symptoms: ['下腰部两侧僵硬酸痛', '久坐后起身直腰困难', '弯腰感到背部拉扯僵死'],
    severityTip: '使用坐姿猫牛式或坐姿前屈抱腿，帮助腰椎间隙释放压力。'
  },
  quadratus_lumborum: {
    muscleId: 'quadratus_lumborum',
    causes: ['习惯性单侧瘫坐或歪向一侧手托腮', '翘二郎腿', '长时间侧倾姿势'],
    symptoms: ['单侧腰部深层剧烈酸痛', '咳嗽或转腰时腰侧抽痛', '一侧腰部活动受限'],
    severityTip: '避免斜靠椅背，做坐姿侧弯伸展可有效拉长单侧紧绷的腰方肌。'
  },
  multifidus: {
    muscleId: 'multifidus',
    causes: ['深层核心无力', '久坐脊柱缺乏屈伸互动', '长久维持不良坐姿'],
    symptoms: ['腰椎中心深层钝痛', '觉得腰部没有支撑力', '久坐几分钟即需频繁换姿势'],
    severityTip: '通过微小幅度的脊柱逐节分节运动和腹式呼吸唤醒深层多裂肌。'
  },
  wrist_extensors: {
    muscleId: 'wrist_extensors',
    causes: ['打字时手腕悬空下塌', '频繁点击鼠标抬高手指', '键盘无手托支撑'],
    symptoms: ['前臂背侧酸痛僵硬', '伸手指或向上抬手腕时前臂牵拉痛', '俗称网球肘感'],
    severityTip: '配置软质手腕垫，定期做掌心朝内压手背的前臂伸肌拉伸。'
  },
  wrist_flexors: {
    muscleId: 'wrist_flexors',
    causes: ['紧握鼠标用力过猛', '长期手腕压在桌沿边缘', '频繁打字握拳'],
    symptoms: ['手腕掌侧酸胀', '握拳时手腕无力', '前臂掌侧靠近手肘处紧绷'],
    severityTip: '做手指朝下掌心向前的伸腕拉伸，缓解手腕管道压迫。'
  },
  intrinsic_hand: {
    muscleId: 'intrinsic_hand',
    causes: ['长时间高速敲击键盘', '频繁在手机屏幕上大拇指滑动', '捏握鼠标手势紧张'],
    symptoms: ['手掌大鱼际酸痛', '手指关节僵硬抽搐', '俗称“鼠标手”、“手机手”'],
    severityTip: '用对侧手掌按摩大鱼际，做双手五指张开对压伸展。'
  },
  gluteus_maximus: {
    muscleId: 'gluteus_maximus',
    causes: ['连续坐着超过2小时不上厕所/喝水', '椅面过硬压迫臀部血液循环'],
    symptoms: ['坐骨结节周围麻木酸痛', '起立时感觉臀部发软无力（臀肌失忆）', '臀线部位压痛'],
    severityTip: '每小时站立走动1-2分钟，做坐姿抱膝压胸拉伸。'
  },
  gluteus_medius: {
    muscleId: 'gluteus_medius',
    causes: ['翘二郎腿', '盘腿坐于办公椅', '站立时习惯把重心单侧倾斜'],
    symptoms: ['髋骨外侧酸胀', '久坐起身走路时髋部不适', '走步时骨盆摇晃不稳定'],
    severityTip: '做坐姿4字交叉盘腿前倾拉伸，解开臀外侧紧绷结节。'
  },
  piriformis: {
    muscleId: 'piriformis',
    causes: ['习惯翘二郎腿', '坐姿双腿过度外展或交叉', '长时间坐在硬椅上'],
    symptoms: ['臀部深层有个很深的压痛点', '疼痛顺着臀部向大腿后侧放射（类似坐骨神经痛）'],
    severityTip: '避免翘二郎腿！坐姿4字拉伸是解开梨状肌卡压的黄金动作。'
  },
  quadriceps: {
    muscleId: 'quadriceps',
    causes: ['长时间膝关节屈曲90度以下坐姿', '缺乏大腿前侧伸展'],
    symptoms: ['大腿前侧紧绷绷', '膝关节上方隐痛', '起身站立时膝盖卡顿'],
    severityTip: '利用办公椅或站立扶墙做单腿后勾拉大腿前侧。'
  },
  hamstrings: {
    muscleId: 'hamstrings',
    causes: ['长时间屈膝坐姿导致大腿后侧肌肉持续缩短', '椅面前沿过高压迫大腿底部'],
    symptoms: ['大腿后侧僵硬无弹性', '弯腰摸脚尖时大腿后侧极度拉扯刺痛', '牵拉骨盆导致腰平驼背'],
    severityTip: '将脚跟搁在矮凳或扶着椅面做单腿勾脚前倾拉伸。'
  },
  gastrocnemius_soleus: {
    muscleId: 'gastrocnemius_soleus',
    causes: ['长期下肢下垂不活动导致静脉回流变慢', '穿高跟鞋久坐', '脚尖绷直坐姿'],
    symptoms: ['下午下班时小腿胀痛肿胀', '跟腱部位僵硬', '小腿肚经常发紧或抽筋感'],
    severityTip: '坐姿多做勾脚尖-绷脚尖泵血运动，或者靠墙站立做弓步腓肠肌拉伸。'
  },
  tibialis_anterior: {
    muscleId: 'tibialis_anterior',
    causes: ['习惯垫脚尖坐姿或踩在椅腿上', '穿硬底鞋长时间行走或久坐'],
    symptoms: ['小腿前外侧靠近胫骨处酸胀', '勾脚尖觉得小腿前侧发酸'],
    severityTip: '做脚背贴地压脚背动作，放松小腿前侧胫骨肌群。'
  }
};

export const EXERCISES_DATABASE: Exercise[] = [
  {
    id: 'ex_neck_side',
    name: '坐姿颈部侧向拉伸',
    targetMuscleIds: ['upper_trapezius', 'levator_scapulae'],
    primaryMuscleName: '斜方肌上束',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '快速释放颈部两侧压迫感，缓解低头伏案导致的脖子僵硬与头痛。',
    iconName: 'UserCheck',
    steps: [
      { stepNumber: 1, title: '稳定坐姿', detail: '坐在办公椅前1/3处，双脚平放地面，脊柱自然挺直。' },
      { stepNumber: 2, title: '固定肩膀', detail: '右手向下抓紧椅面边缘固定右肩，避免拉伸时肩膀抬起。' },
      { stepNumber: 3, title: '侧倾头部', detail: '左手轻放在头顶右侧，呼气时将头部缓慢向左肩方向侧倾，直到感到右侧颈部有舒适拉伸感。' },
      { stepNumber: 4, title: '保持呼吸', detail: '维持30秒，深长呼吸，换另一侧重复。' }
    ],
    cautions: ['切勿用力猛拉头部，拉伸应感觉舒适微酸而非剧痛。', '保持双肩下沉，不要耸肩。']
  },
  {
    id: 'ex_neck_45_degree',
    name: '45度转头扣首拉伸',
    targetMuscleIds: ['levator_scapulae'],
    primaryMuscleName: '肩胛提肌',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '精准拉伸深层肩胛提肌，专门解决转头卡顿与落枕感。',
    iconName: 'User',
    steps: [
      { stepNumber: 1, title: '转头定位', detail: '保持身体挺直，头部向右旋转45度（面向右膝盖方向）。' },
      { stepNumber: 2, title: '低头下扣', detail: '右手放在后脑勺，缓慢将头部向右膝方向低头扣下。' },
      { stepNumber: 3, title: '感受拉伸', detail: '感到左侧后颈至肩胛骨内上角有深层拉伸感。' },
      { stepNumber: 4, title: '保持呼吸', detail: '保持30秒，缓慢还原后换左侧重复。' }
    ],
    cautions: ['转头角度不宜过大，保持顺畅呼吸。']
  },
  {
    id: 'ex_chin_tuck',
    name: '坐姿收下巴（龟颈矫正）',
    targetMuscleIds: ['sternocleidomastoid'],
    primaryMuscleName: '胸锁乳突肌',
    durationSeconds: 20,
    suggestedSets: '10次/组 x 2 组',
    difficulty: '轻松',
    equipment: '无设备',
    benefits: '重新训练颈部深层屈肌，纠正长时间伸脖子看屏幕形成的龟颈姿势。',
    iconName: 'Smile',
    steps: [
      { stepNumber: 1, title: '平视前方', detail: '双眼平视屏幕，双手可轻放在下巴前作为参照。' },
      { stepNumber: 2, title: '向后收下巴', detail: '像挤双下巴一样，将整个头部水平向后移动，保持视线平视不低头。' },
      { stepNumber: 3, title: '停留挤压', detail: '在极限位置停留3秒，感受后颈拉伸与前颈紧致。' },
      { stepNumber: 4, title: '缓慢放松', detail: '缓慢放松还原，重复10次。' }
    ],
    cautions: ['是平移头部向后，而不是向下低头。']
  },
  {
    id: 'ex_door_chest',
    name: '☕ 咖啡等待双手上举拉伸（胸肌/胸椎舒展）',
    targetMuscleIds: ['pectoralis_major', 'pectoralis_minor'],
    primaryMuscleName: '胸大肌',
    durationSeconds: 30,
    suggestedSets: '2 组 x 30秒',
    difficulty: '初级',
    equipment: '无设备',
    benefits: '利用等咖啡或接水间隙双手上举，迅速舒展紧缩的胸部肌群与胸椎，打开圆肩。',
    iconName: 'Expand',
    steps: [
      { stepNumber: 1, title: '萌宠陪伴', detail: '【☕ 咖啡间隙】站在咖啡机或桌旁，双脚平稳站立，双手交叉握紧。' },
      { stepNumber: 2, title: '双手上举', detail: '【上举伸展】吸气将双手高举过头顶，掌心朝上，身体向上自然延伸。' },
      { stepNumber: 3, title: '胸腔打开', detail: '【胸肌舒展】呼气时双臂微向后上方延伸，感受胸前大肌与胸椎温和拉开。' },
      { stepNumber: 4, title: '平稳复位', detail: '【呼吸平稳】保持平稳呼吸30秒，缓慢放下双手，感觉神清气爽！' }
    ],
    cautions: ['避免腰部过度塌腰拱起，保持核心微收。']
  },
  {
    id: 'ex_chest_hug_stretch',
    name: '🐱 猫咪抱臂拱背伸展（解锁上背酸痛）',
    targetMuscleIds: ['rhomboids', 'middle_lower_trapezius'],
    primaryMuscleName: '菱形肌',
    durationSeconds: 30,
    suggestedSets: '2 组 x 30秒',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '像小猫伸懒腰一样椅上抱臂拱背，拉开两肩胛骨中间僵硬的菱形肌，缓解上背部隐痛。',
    iconName: 'HeartHandshake',
    steps: [
      { stepNumber: 1, title: '猫咪抱肩', detail: '【🐱 猫咪陪伴】坐在椅子上，双手交叉抱住对侧肩膀（给自己的猫咪式拥抱）。' },
      { stepNumber: 2, title: '吐气拱背', detail: '【低头拱背】呼气时缓慢低头下巴贴胸，手肘向前推，上背部向后拱起。' },
      { stepNumber: 3, title: '背肌拉开', detail: '【感觉展开】感觉两个肩胛骨像猫咪伸懒腰一样向两侧拉开，上背充分伸展。' },
      { stepNumber: 4, title: '吸气还原', detail: '【深呼吸】保持30秒，深呼吸将空气送入上背部，复位释放酸痛。' }
    ],
    cautions: ['顺应呼吸缓慢弯曲，不要强行发力拱腰。']
  },
  {
    id: 'ex_wall_w_squeeze',
    name: '🐣 小鸡翅膀夹紧（靠墙W字背肌收缩）',
    targetMuscleIds: ['middle_lower_trapezius', 'rhomboids'],
    primaryMuscleName: '斜方肌中下束',
    durationSeconds: 30,
    suggestedSets: '12次/组 x 2 组',
    difficulty: '初级',
    equipment: '墙面',
    benefits: '双手形成W字形态（小鸡小翅膀），唤醒沉睡的中下斜方肌，改善圆肩与驼背。',
    iconName: 'ShieldCheck',
    steps: [
      { stepNumber: 1, title: '小鸡造型', detail: '【🐣 萌宠陪伴】背部靠墙站立或坐直，双臂弯曲摆出大写字母“W”形态（像小鸡小翅膀）。' },
      { stepNumber: 2, title: '向下夹背', detail: '【夹紧背肌】呼气时将手肘向两侧下方拉，用劲夹紧背部下方肩胛骨。' },
      { stepNumber: 3, title: '充分挤压', detail: '【唤醒中下斜方肌】在底部挤压背肌2秒，感受到斜方肌中下束酸爽发力。' },
      { stepNumber: 4, title: '维持还原', detail: '【循环练习】缓慢还原成W型，重复12次，彻底告别圆肩驼背。' }
    ],
    cautions: ['避免下背部大幅度挺肚子离墙。']
  },
  {
    id: 'ex_arm_external_rotation',
    name: '桌面手肘外旋伸展',
    targetMuscleIds: ['infraspinatus_teres_minor', 'supraspinatus'],
    primaryMuscleName: '冈下肌/小圆肌',
    durationSeconds: 30,
    suggestedSets: '2 组 x 30秒',
    difficulty: '初级',
    equipment: '办公桌',
    benefits: '逆转长期双手内旋打字带来的肩膀内部卡压，恢复肩关节外旋柔韧度。',
    iconName: 'RotateCw',
    steps: [
      { stepNumber: 1, title: '放置手肘', detail: '面对办公桌站立或坐着，将双肘弯曲90度放在桌面上，掌心向上。' },
      { stepNumber: 2, title: '后撤臀部', detail: '身体向后微退，下巴微扣，将胸部向地面下沉。' },
      { stepNumber: 3, title: '展开双手', detail: '双手握拳向外展开，感到肩膀后侧深层有温和的拉伸感。' },
      { stepNumber: 4, title: '停留呼吸', detail: '保持30秒，缓慢平稳呼吸。' }
    ],
    cautions: ['肩关节有剧烈疼痛者减小下沉幅度。']
  },
  {
    id: 'ex_seated_cat_cow',
    name: '坐姿猫牛式脊柱疏通',
    targetMuscleIds: ['erector_spinae', 'multifidus'],
    primaryMuscleName: '竖脊肌',
    durationSeconds: 45,
    suggestedSets: '10 循环 x 2 组',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '逐节活动腰椎与胸椎，释放久坐积聚的腰部椎间盘压力。',
    iconName: 'Activity',
    steps: [
      { stepNumber: 1, title: '手扶双手膝盖', detail: '坐在椅子前三分之一，双脚踩实地面，双手放在膝盖上。' },
      { stepNumber: 2, title: '吸气挺胸（牛式）', detail: '吸气时坐骨踩实，抬头挺胸抬头，腰椎自然微拱，打开胸腔。' },
      { stepNumber: 3, title: '呼气拱背（猫式）', detail: '呼气时收缩腹部，低头看肚脐，将整条脊柱向后拱成C弧形。' },
      { stepNumber: 4, title: '流畅交替', detail: '跟随呼吸平缓交替做10个循环。' }
    ],
    cautions: ['动作要柔和连贯，配合呼吸不憋气。']
  },
  {
    id: 'ex_seated_side_bend',
    name: '坐姿侧弯拉伸（解腰酸）',
    targetMuscleIds: ['quadratus_lumborum'],
    primaryMuscleName: '腰方肌',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '专门拉长单侧紧绷的腰方肌，快速缓解坐姿不端导致的单侧腰痛。',
    iconName: 'ArrowRightLeft',
    steps: [
      { stepNumber: 1, title: '抓稳椅面', detail: '坐姿挺直，左手抓紧椅面固定骨盆。' },
      { stepNumber: 2, title: '举手臂侧弯', detail: '右手高举过头伸直，呼气时将上半身向左侧弯曲。' },
      { stepNumber: 3, title: '感受右腰舒展', detail: '保持右侧臀部不离开椅面，感受到右侧侧腰及腰后部深层被拉开。' },
      { stepNumber: 4, title: '换侧重复', detail: '保持30秒，吸气还原，换另一侧。' }
    ],
    cautions: ['保证双侧坐骨始终贴紧椅面，不要抬起臀部。']
  },
  {
    id: 'ex_wrist_extensor_stretch',
    name: '前臂伸肌拉伸（鼠标手救星）',
    targetMuscleIds: ['wrist_extensors', 'intrinsic_hand'],
    primaryMuscleName: '腕伸肌群',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '轻松',
    equipment: '无设备',
    benefits: '放松打字和点鼠标高频使用的前臂背侧肌群，预防网球肘与手腕痛。',
    iconName: 'Hand',
    steps: [
      { stepNumber: 1, title: '伸直手臂', detail: '右手臂向前平举伸直，手掌朝下，手指自然下垂。' },
      { stepNumber: 2, title: '轻压手背', detail: '用左手抓住右手背，缓慢将右手掌向身体方向下压屈曲。' },
      { stepNumber: 3, title: '感到前臂拉伸', detail: '感受到右前臂上方背侧有明显的牵拉感。' },
      { stepNumber: 4, title: '保持', detail: '维持30秒，然后换左手臂重复。' }
    ],
    cautions: ['保持手肘微伸直但不过度锁死。']
  },
  {
    id: 'ex_wrist_flexor_stretch',
    name: '前臂屈肌拉伸（手腕掌侧）',
    targetMuscleIds: ['wrist_flexors'],
    primaryMuscleName: '腕屈肌群',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '轻松',
    equipment: '无设备',
    benefits: '解开手腕掌侧压迫，舒缓握鼠标与握拳带来的掌侧肌肉绷紧。',
    iconName: 'HandMetal',
    steps: [
      { stepNumber: 1, title: '平举推掌', detail: '右手臂向前平举，手掌朝前，手指向上（做出“停止”手势）。' },
      { stepNumber: 2, title: '拉向自己', detail: '左手抓住右手指尖，缓慢向身体方向往回拉。' },
      { stepNumber: 3, title: '感受掌侧舒展', detail: '感受到右前臂掌侧及手腕前侧的舒畅伸展。' },
      { stepNumber: 4, title: '换侧重复', detail: '维持30秒，呼吸平稳，换另一侧。' }
    ],
    cautions: ['力度温和，手指轻拉即可。']
  },
  {
    id: 'ex_hand_thumb_massage',
    name: '手部大鱼际与手指弹拨',
    targetMuscleIds: ['intrinsic_hand'],
    primaryMuscleName: '手部内在肌',
    durationSeconds: 45,
    suggestedSets: '双手各 1 分钟',
    difficulty: '轻松',
    equipment: '无设备',
    benefits: '缓解大拇指根部（大鱼际）酸痛，释放频繁敲击键盘带来的手指僵硬。',
    iconName: 'Sparkles',
    steps: [
      { stepNumber: 1, title: '按揉大鱼际', detail: '用左手大拇指肚，顺时针圈状按揉右手大拇指下方厚厚的肉垫（大鱼际肌）。' },
      { stepNumber: 2, title: '对压掌心', detail: '寻找酸痛敏感点，按压停留5秒并配合深呼吸。' },
      { stepNumber: 3, title: '五指张开伸展', detail: '双手掌心相对，五指指尖对压，向外撑开所有手指骨间。' }
    ],
    cautions: ['避免用指甲抓捏，使用手指肚按压。']
  },
  {
    id: 'ex_seated_figure_4',
    name: '坐姿“4”字盘腿臀肌拉伸',
    targetMuscleIds: ['piriformis', 'gluteus_medius', 'gluteus_maximus'],
    primaryMuscleName: '梨状肌',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '初级',
    equipment: '办公椅',
    benefits: 'MeloStretch 办公室王牌动作！释放久坐臀部麻木与坐骨神经压迫。',
    iconName: 'Flame',
    steps: [
      { stepNumber: 1, title: '跨腿摆“4”字', detail: '坐在椅子前部，将右脚踝放在左大腿膝盖上方，右膝自然向下打开，双腿呈数字“4”。' },
      { stepNumber: 2, title: '直腰前倾', detail: '双手轻扶右小腿，保持脊柱挺直（不要塌腰驼背），呼气时上半身以髋关节为轴向前倾。' },
      { stepNumber: 3, title: '感受臀部深层酸爽', detail: '感觉到右侧臀部深层（梨状肌与臀肌）有强烈的舒爽拉伸感。' },
      { stepNumber: 4, title: '保持与换侧', detail: '停留30秒深呼吸，缓慢起身，换左腿重复。' }
    ],
    cautions: ['前倾时务必保持背部直立，不要弯腰塌背，拉伸感会更精准深刻。']
  },
  {
    id: 'ex_standing_quad_stretch',
    name: '单腿站立/椅上勾脚伸大腿',
    targetMuscleIds: ['quadriceps'],
    primaryMuscleName: '股四头肌',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '初级',
    equipment: '办公椅',
    benefits: '拉长因长时间90度屈膝久坐而缩短的大腿前侧，缓解膝盖上方紧绷。',
    iconName: 'Zap',
    steps: [
      { stepNumber: 1, title: '扶椅站立', detail: '一手扶着办公椅背或桌面保持平衡，单脚站立。' },
      { stepNumber: 2, title: '向后抓脚踝', detail: '另一只手向后抓住同侧脚踝，将脚跟拉向臀部。' },
      { stepNumber: 3, title: '并拢双膝', detail: '保持双膝靠近，骨盆微后倾，感受大腿前侧明显的拉伸。' },
      { stepNumber: 4, title: '保持', detail: '保持30秒，换另一侧。' }
    ],
    cautions: ['不要过度向后大弯腰，保持身体垂直。']
  },
  {
    id: 'ex_seated_hamstring_stretch',
    name: '坐姿单腿勾脚大腿后侧伸展',
    targetMuscleIds: ['hamstrings'],
    primaryMuscleName: '腘绳肌',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '舒缓大腿后侧僵硬，恢复肌肉弹性，减轻对骨盆后倾的牵拉。',
    iconName: 'Sun',
    steps: [
      { stepNumber: 1, title: '伸直一腿', detail: '坐在椅子边缘，右腿向前伸直，脚跟踩地，脚尖向上勾起；左腿屈膝踩实。' },
      { stepNumber: 2, title: '挺胸前倾', detail: '双手放在左大腿上，保持背部平直，呼气时身体向前倾。' },
      { stepNumber: 3, title: '感受腿后侧拉伸', detail: '感受到右大腿后侧及膝盖窝有顺畅的拉伸感。' },
      { stepNumber: 4, title: '换侧重复', detail: '保持30秒，换左腿伸直。' }
    ],
    cautions: ['脚尖尽量勾紧，前倾时不要弓腰。']
  },
  {
    id: 'ex_calf_pump_and_stretch',
    name: '🐾 小熊垫脚泵血（坐姿/弓步踝泵放松）',
    targetMuscleIds: ['gastrocnemius_soleus'],
    primaryMuscleName: '腓肠肌/比目鱼肌',
    durationSeconds: 30,
    suggestedSets: '两侧各 2 组 x 30秒',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '像小熊踏步一样坐姿快速交替踮脚或弓步伸展，促进下肢血液循环回流，消退小腿肿胀与麻木。',
    iconName: 'Compass',
    steps: [
      { stepNumber: 1, title: '小熊踏步', detail: '【🐾 萌宠陪伴】坐在办公椅上或双手扶墙，双脚平放在地面上。' },
      { stepNumber: 2, title: '交替踮脚', detail: '【快速踝泵】像小熊踏步一样，快速交替高高踮起脚尖与勾起脚掌。' },
      { stepNumber: 3, title: '泵血循环', detail: '【促进回流】感受小腿肚肌肉像泵水一样交替收缩与舒张，加速血液循环。' },
      { stepNumber: 4, title: '消退麻木', detail: '【极速充电】持续30秒，瞬间消退下午坐久了的脚麻与小腿沉重感。' }
    ],
    cautions: ['脚尖朝正前方，保持动作节奏流畅。']
  },
  {
    id: 'ex_tibialis_toe_press',
    name: '坐姿压脚背小腿前侧放松',
    targetMuscleIds: ['tibialis_anterior'],
    primaryMuscleName: '胫骨前肌',
    durationSeconds: 25,
    suggestedSets: '两侧各 2 组 x 25秒',
    difficulty: '轻松',
    equipment: '办公椅',
    benefits: '放松小腿前外侧胫骨肌群，解决习惯性踩椅腿带来的前小腿发酸。',
    iconName: 'Feather',
    steps: [
      { stepNumber: 1, title: '脚背扣地', detail: '坐在椅子上，将右脚向后收，脚背朝下，脚趾扣在地面上。' },
      { stepNumber: 2, title: '轻微下压', detail: '身体稍向前施加轻微压力，让脚背与小腿前侧形成伸展。' },
      { stepNumber: 3, title: '感受放松', detail: '感受小腿前外侧靠近胫骨处的拉伸感。' },
      { stepNumber: 4, title: '换侧重复', detail: '保持25秒，换左脚。' }
    ],
    cautions: ['动作要轻柔，避免脚趾抽筋。']
  }
];

export const OFFICE_SOLUTIONS: SolutionRoutine[] = [
  {
    id: 'sol_neck_shoulder_3min',
    title: '3分钟肩颈急救放松',
    subtitle: '适合：低头打字久了，脖子沉重僵硬、肩头酸痛',
    durationMinutes: 3,
    category: '肩颈舒缓',
    description: '通过精准拉伸斜方肌上束、肩胛提肌与收下巴纠正龟颈，快速释放颈椎压迫。',
    icon: 'Sparkles',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    exerciseIds: ['ex_neck_side', 'ex_neck_45_degree', 'ex_chin_tuck']
  },
  {
    id: 'sol_lumbar_back_5min',
    title: '5分钟腰背积压释放',
    subtitle: '适合：久坐腰酸背痛、弯腰困难、坐久了直不起腰',
    durationMinutes: 5,
    category: '腰背舒缓',
    description: '组合猫牛式脊柱疏通、腰方肌侧弯拉伸与抱臂拱背，拯救不堪重负的腰椎。',
    icon: 'Activity',
    tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
    exerciseIds: ['ex_seated_cat_cow', 'ex_seated_side_bend', 'ex_chest_hug_stretch', 'ex_wall_w_squeeze']
  },
  {
    id: 'sol_mouse_hand_3min',
    title: '3分钟鼠标手恢复方案',
    subtitle: '适合：手腕酸麻、前臂发紧、大拇指按键盘僵硬',
    durationMinutes: 3,
    category: '手腕手臂',
    description: '前臂伸肌屈肌双向伸展配合手部大鱼际按揉，告别键盘手与鼠标手。',
    icon: 'Hand',
    tagColor: 'bg-green-100 text-green-800 border-green-200',
    exerciseIds: ['ex_wrist_extensor_stretch', 'ex_wrist_flexor_stretch', 'ex_hand_thumb_massage']
  },
  {
    id: 'sol_sedentary_hips_legs_5min',
    title: '5分钟久坐臀腿唤醒',
    subtitle: '适合：坐久了屁股发麻、坐骨神经不适、小腿肿胀',
    durationMinutes: 5,
    category: '臀腿循环',
    description: '采用办公室王牌“4”字盘腿拉伸梨状肌，搭配腿后侧与靠墙弓步，促进下肢血液循环。',
    icon: 'Flame',
    tagColor: 'bg-lime-100 text-lime-800 border-lime-200',
    exerciseIds: ['ex_seated_figure_4', 'ex_seated_hamstring_stretch', 'ex_calf_pump_and_stretch']
  }
];

export const SYMPTOM_QUICK_TAGS = [
  { tag: '肩颈沉重酸胀', muscleId: 'upper_trapezius' },
  { tag: '转头刺痛落枕感', muscleId: 'levator_scapulae' },
  { tag: '前颈紧绷前倾脖', muscleId: 'sternocleidomastoid' },
  { tag: '上背中间隐痛', muscleId: 'rhomboids' },
  { tag: '含胸圆肩驼背', muscleId: 'pectoralis_major' },
  { tag: '久坐腰酸直不起', muscleId: 'erector_spinae' },
  { tag: '单侧下腰酸痛', muscleId: 'quadratus_lumborum' },
  { tag: '鼠标手手腕酸痛', muscleId: 'wrist_extensors' },
  { tag: '手掌大拇指发僵', muscleId: 'intrinsic_hand' },
  { tag: '臀部深层发麻酸爽', muscleId: 'piriformis' },
  { tag: '大腿后侧僵硬', muscleId: 'hamstrings' },
  { tag: '下午小腿肿胀发紧', muscleId: 'gastrocnemius_soleus' }
];
