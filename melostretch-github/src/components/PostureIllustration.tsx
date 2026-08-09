import React from 'react';
import { Exercise } from '../types';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Compass, Zap, Flame } from 'lucide-react';

interface PostureIllustrationProps {
  exercise: Exercise;
  currentStepIndex?: number;
}

export const PostureIllustration: React.FC<PostureIllustrationProps> = ({ exercise, currentStepIndex = 0 }) => {
  const isBackStretch = exercise.id.includes('hug') || exercise.name.includes('抱臂') || exercise.name.includes('鹰手臂') || exercise.name.includes('拱背') || (exercise.id.includes('back') && !exercise.name.includes('W字') && !exercise.name.includes('收缩') && !exercise.name.includes('夹'));
  const isBackSqueeze = exercise.id.includes('w_squeeze') || exercise.name.includes('W字') || exercise.name.includes('收缩') || exercise.name.includes('夹');
  const isCatCow = exercise.id.includes('cat_cow') || exercise.name.includes('猫牛');
  const isNeckChin = exercise.id.includes('chin') || exercise.name.includes('下巴');
  const isNeckSide = exercise.id.includes('neck') || exercise.name.includes('颈') || (!isNeckChin && exercise.targetMuscleIds.some(m => m.includes('trapezius') || m.includes('scapulae')));
  const isWristHand = exercise.id.includes('wrist') || exercise.id.includes('hand') || exercise.name.includes('手腕') || exercise.name.includes('前臂') || exercise.name.includes('大鱼际');
  const isChest = exercise.id.includes('chest') || exercise.name.includes('胸') || exercise.targetMuscleIds.some(m => m.includes('pectoralis'));
  const isRotation = exercise.id.includes('rotation') || exercise.name.includes('外旋');
  const isSideBend = exercise.id.includes('side_bend') || exercise.name.includes('侧弯');
  const isFigure4 = exercise.id.includes('figure_4') || exercise.name.includes('4”字') || exercise.name.includes('盘腿');
  const isLegs = exercise.id.includes('quad') || exercise.id.includes('hamstring') || exercise.name.includes('腿');
  const isCalfPump = exercise.id.includes('calf') || exercise.id.includes('pump') || exercise.name.includes('小腿') || exercise.name.includes('踏步') || exercise.name.includes('脚背');

  const currentStep = exercise.steps[currentStepIndex] || exercise.steps[0];

  // Tailored intuitive mental analogies
  const getAnalogy = () => {
    if (isBackStretch) return '💡 脑海画面：像小猫伸懒腰一样抱臂拱背/双手交缠，手肘向前推，将两块肩胛骨向两侧彻底拉开，把积压的上背酸痛解脱！';
    if (isBackSqueeze) return '💡 脑海画面：想象两块肩胛骨中间夹着一枚硬币，双手摆成W字向下拉时用两侧肩胛骨往中间靠拢，把硬币夹紧。';
    if (isCatCow) return '💡 脑海画面：想象脊柱像一串波浪珍珠项链，一呼一吸逐节向前弯曲拱起与反向展开，疏通椎间盘压迫。';
    if (isNeckChin) return '💡 脑海画面：视线平视前方，想象后脑勺像电梯向上平移，用食指微推下巴向后做双下巴，拉长后颈。';
    if (isNeckSide) return '💡 脑海画面：想象耳朵像磁铁一样慢吞吞去贴近同侧肩膀，同时对侧肩膀自然沉下，绝不拔高耸肩。';
    if (isWristHand) return '💡 脑海画面：手臂伸得像直尺一样平，另一手轻轻向后拉指尖或按揉大鱼际，给劳累的打字手腕做舒缓SPA。';
    if (isChest) return '💡 脑海画面：想象胸膛像一扇双开大门向两侧彻底张开，高举双手或贴墙，吸气时感觉锁骨下方大面积展开。';
    if (isRotation) return '💡 脑海画面：手肘固定在桌面，小臂向外转开，反向解开长时间打字带来的肩关节内旋卡压。';
    if (isSideBend) return '💡 脑海画面：身体像在两扇紧贴的玻璃之间侧弯，高举双手，拉长单侧紧绷的下腰方肌。';
    if (isFigure4) return '💡 脑海画面：脊柱如挺拔竹子不弯腰，以髋关节为轴心向前平直倾折，深层拉开屁股麻木与坐骨神经。';
    if (isLegs) return '💡 脑海画面：保持骨盆正对前方，勾脚尖平直前倾或后勾脚，感受大腿前/后侧肌群被温和拉长。';
    if (isCalfPump) return '💡 脑海画面：像小熊踏步或脚泵一样快速交替踮脚与勾脚，促进血液快速回流，消退小腿麻木肿胀。';
    return '💡 保持自然深呼吸，缓慢伸展肌肉，体会目标区域被温和拉长的感觉，切勿发力过猛。';
  };

  const getKeyPoints = () => {
    if (isBackStretch) {
      return [
        { label: '发力方向', text: '双手抱臂/缠绕，低头微拱背，手肘向前推，将两肩胛骨向两侧拉开' },
        { label: '呼吸要领', text: '深吸气充满上背部，呼气顺应张力将菱形肌向外充分拉长' },
        { label: '目标感觉', text: '两肩胛骨中间（菱形肌与上背）有贯穿舒爽的温和牵拉感' }
      ];
    }
    if (isBackSqueeze) {
      return [
        { label: '发力方向', text: '双肩下沉，手肘向两侧下拉，两肩胛骨向脊柱中心收紧靠拢' },
        { label: '呼吸要领', text: '向上准备时吸气，双手下拉夹背时呼气收紧背肌' },
        { label: '目标感觉', text: '斜方肌中下束与菱形肌酸爽发力收缩，强化背部支撑力' }
      ];
    }
    if (isNeckChin) {
      return [
        { label: '发力方向', text: '平视前方，食指轻推下巴向后平移，保持后颈垂直延伸' },
        { label: '呼吸要领', text: '收下巴时保持均匀腹式呼吸，切勿憋气' },
        { label: '目标感觉', text: '后颈深层屈肌酸爽激活，告别龟颈与前倾沉重感' }
      ];
    }
    if (isNeckSide) {
      return [
        { label: '发力方向', text: '头向一侧倾斜/转45度，对侧肩膀自然下沉下压' },
        { label: '呼吸要领', text: '呼气时手重力配合下压增加张力，吸气保持不动' },
        { label: '目标感觉', text: '颈侧至斜方肌中上段有温和延伸拉伸感，非刺痛' }
      ];
    }
    if (isWristHand) {
      return [
        { label: '发力方向', text: '手臂向前平举锁定，手指指向地面或天空并向后牵拉' },
        { label: '呼吸要领', text: '维持均匀腹式呼吸，每个呼气配合微幅加深拉伸' },
        { label: '目标感觉', text: '前臂屈肌或伸肌群产生贯穿手腕的放松沉降感' }
      ];
    }
    return [
      { label: '发力方向', text: '顺应肌肉走向平缓延伸，避免身体代偿扭曲' },
      { label: '呼吸要领', text: '保持深吸慢呼，切勿在发力或保持时憋气' },
      { label: '目标感觉', text: '目标肌肉获得充分延伸，关节无压迫疼痛' }
    ];
  };

  const keyPoints = getKeyPoints();

  return (
    <div className="w-full bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-800/50 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Lightbulb className="w-4 h-4 text-amber-300 animate-pulse" />
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-200 flex items-center gap-1.5">
              <span>动作发力指南 & 易错 Tips</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
                脑海意念发力
              </span>
            </h4>
            <p className="text-[11px] text-emerald-100/90 mt-0.5">
              无需复杂图解，用生活化意念快速把动作做对
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 hidden sm:inline-block">
          目标：{exercise.primaryMuscleName}
        </span>
      </div>

      {/* Main Analogy Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-xs leading-relaxed text-emerald-100 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-amber-300 block text-xs">
            脑海发力画面（像这样想象）：
          </span>
          <p className="text-emerald-50 text-xs leading-relaxed">
            {getAnalogy()}
          </p>
        </div>
      </div>

      {/* Key Triplet Points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {keyPoints.map((kp, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/20 text-xs">
            <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block mb-1">
              {idx + 1}. {kp.label}
            </span>
            <p className="text-emerald-100 text-[11px] leading-snug">
              {kp.text}
            </p>
          </div>
        ))}
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
        <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300 block">✅ 正确表现：</span>
            <span>目标肌群有被拉长的酸温感，呼吸平稳顺畅</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block">❌ 避坑误区：</span>
            <span>切勿耸肩、憋气或用力过猛导致关节尖锐刺痛</span>
          </div>
        </div>
      </div>
    </div>
  );
};
