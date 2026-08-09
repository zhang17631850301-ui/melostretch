import React, { useState, useEffect, useRef } from 'react';
import { BodyView, MuscleInfo, Exercise } from '../types';
import { MUSCLES_LIST, MUSCLE_STRAINS } from '../data/meloStretchData';
import { getGeminiRequestHeaders } from '../utils/geminiKey';
import { 
  Search, Sparkles, Filter, Info, ChevronRight, HelpCircle, Move, Copy, 
  RotateCcw, Check, Edit3, Sliders, Loader2, AlertCircle, Play, Heart, 
  ShieldAlert, Activity, ArrowRight, Lightbulb, Zap, Plus, X
} from 'lucide-react';

import bodyMapFrontImg from '../assets/images/front_bun_match_1785666181945.jpg';
import bodyMapBackImg from '../assets/images/back_bun_match_1785666194334.jpg';

interface BodyMapProps {
  onSelectMuscle: (muscle: MuscleInfo) => void;
  selectedMuscleId?: string;
  onStartExercise?: (ex: Exercise) => void;
  onToggleFavorite?: (id: string) => void;
  favorites?: string[];
}

interface MuscleHotspot {
  id: string;
  name: string;
  view: 'front' | 'back' | 'both';
  side: 'left' | 'right';
  bodyX: number;
  bodyY: number;
  tagY: number;
}

interface AiPainAnalysis {
  symptomTitle: string;
  painCauses: { title: string; detail: string }[];
  reliefMethods: string[];
  relatedMuscleNames: string[];
  recommendedExercises: Exercise[];
}

// Back view hotspots default
const DEFAULT_BACK_HOTSPOTS: MuscleHotspot[] = [
  { id: 'upper_trapezius', name: '斜方肌上束', view: 'back', side: 'left', bodyX: 172, bodyY: 158, tagY: 158 },
  { id: 'rhomboids', name: '菱形肌', view: 'back', side: 'left', bodyX: 182, bodyY: 188, tagY: 188 },
  { id: 'middle_lower_trapezius', name: '斜方肌中下束', view: 'back', side: 'left', bodyX: 185, bodyY: 210, tagY: 210 },
  { id: 'erector_spinae', name: '竖脊肌', view: 'back', side: 'left', bodyX: 182, bodyY: 228, tagY: 228 },
  { id: 'quadratus_lumborum', name: '腰方肌', view: 'back', side: 'left', bodyX: 168, bodyY: 245, tagY: 245 },
  { id: 'gluteus_maximus', name: '臀大肌', view: 'back', side: 'left', bodyX: 175, bodyY: 295, tagY: 295 },
  { id: 'hamstrings', name: '腘绳肌', view: 'back', side: 'left', bodyX: 172, bodyY: 365, tagY: 365 },
  { id: 'gastrocnemius_soleus', name: '腓肠肌', view: 'back', side: 'left', bodyX: 170, bodyY: 425, tagY: 425 },

  { id: 'levator_scapulae', name: '肩胛提肌', view: 'back', side: 'right', bodyX: 208, bodyY: 156, tagY: 156 },
  { id: 'supraspinatus', name: '冈上肌', view: 'back', side: 'right', bodyX: 215, bodyY: 172, tagY: 172 },
  { id: 'infraspinatus_teres_minor', name: '冈下肌', view: 'back', side: 'right', bodyX: 220, bodyY: 198, tagY: 198 },
  { id: 'multifidus', name: '多裂肌', view: 'back', side: 'right', bodyX: 198, bodyY: 242, tagY: 242 },
  { id: 'gluteus_medius', name: '臀中肌', view: 'back', side: 'right', bodyX: 224, bodyY: 280, tagY: 280 },
  { id: 'piriformis', name: '梨状肌', view: 'back', side: 'right', bodyX: 200, bodyY: 300, tagY: 300 },
  { id: 'tibialis_anterior', name: '胫骨前肌', view: 'back', side: 'right', bodyX: 205, bodyY: 425, tagY: 425 }
];

// Front view hotspots default
const DEFAULT_FRONT_HOTSPOTS: MuscleHotspot[] = [
  { id: 'sternocleidomastoid', name: '胸锁乳突肌', view: 'front', side: 'left', bodyX: 180, bodyY: 148, tagY: 148 },
  { id: 'pectoralis_minor', name: '胸小肌', view: 'front', side: 'left', bodyX: 172, bodyY: 185, tagY: 185 },
  { id: 'wrist_extensors', name: '腕伸肌群', view: 'front', side: 'left', bodyX: 136, bodyY: 255, tagY: 255 },
  { id: 'intrinsic_hand', name: '手部内在肌', view: 'front', side: 'left', bodyX: 128, bodyY: 315, tagY: 315 },
  { id: 'quadriceps', name: '股四头肌', view: 'front', side: 'left', bodyX: 172, bodyY: 360, tagY: 360 },

  { id: 'upper_trapezius', name: '斜方肌上束', view: 'front', side: 'right', bodyX: 212, bodyY: 158, tagY: 158 },
  { id: 'pectoralis_major', name: '胸大肌', view: 'front', side: 'right', bodyX: 208, bodyY: 192, tagY: 192 },
  { id: 'wrist_flexors', name: '腕屈肌群', view: 'front', side: 'right', bodyX: 244, bodyY: 255, tagY: 255 },
  { id: 'gluteus_medius', name: '臀中肌', view: 'front', side: 'right', bodyX: 226, bodyY: 280, tagY: 280 },
  { id: 'tibialis_anterior', name: '胫骨前肌', view: 'front', side: 'right', bodyX: 208, bodyY: 425, tagY: 425 }
];

export const BodyMap: React.FC<BodyMapProps> = ({
  onSelectMuscle,
  selectedMuscleId,
  onStartExercise,
  onToggleFavorite,
  favorites = []
}) => {
  const [view, setView] = useState<BodyView>('back');
  const [hoveredMuscleId, setHoveredMuscleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // AI Pain Search States
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiPainAnalysis | null>(null);

  // Calibration drag & edit mode state
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const PRESET_SYMPTOMS = [
    '肩膀酸痛沉重',
    '低头脖子发硬手麻',
    '久坐腰酸下背刺痛',
    '鼠标手手腕酸紧',
    '偏头痛与后脑勺发紧',
    '腿酸与小腿抽筋'
  ];

  // Editable hotspots state
  const [backHotspots, setBackHotspots] = useState<MuscleHotspot[]>(() => {
    try {
      const saved = localStorage.getItem('melostretch_back_hotspots');
      return saved ? JSON.parse(saved) : DEFAULT_BACK_HOTSPOTS;
    } catch {
      return DEFAULT_BACK_HOTSPOTS;
    }
  });

  const [frontHotspots, setFrontHotspots] = useState<MuscleHotspot[]>(() => {
    try {
      const saved = localStorage.getItem('melostretch_front_hotspots');
      return saved ? JSON.parse(saved) : DEFAULT_FRONT_HOTSPOTS;
    } catch {
      return DEFAULT_FRONT_HOTSPOTS;
    }
  });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeHotspots = view === 'back' ? backHotspots : frontHotspots;
  const currentImage = view === 'back' ? bodyMapBackImg : bodyMapFrontImg;

  // Image loading state & preloading to eliminate lag
  const [isImgLoaded, setIsImgLoaded] = useState<boolean>(false);

  // Preload both front and back images into memory cache immediately on mount
  useEffect(() => {
    const imgFront = new Image();
    imgFront.src = bodyMapFrontImg;
    const imgBack = new Image();
    imgBack.src = bodyMapBackImg;
  }, []);

  // Track image load state whenever current view changes
  useEffect(() => {
    const img = new Image();
    img.src = currentImage;
    if (img.complete) {
      setIsImgLoaded(true);
    } else {
      setIsImgLoaded(false);
      img.onload = () => setIsImgLoaded(true);
      img.onerror = () => setIsImgLoaded(true); // fallback gracefully
    }
  }, [currentImage]);

  // Auto-save hotspots to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('melostretch_back_hotspots', JSON.stringify(backHotspots));
    } catch (err) {
      console.error('Failed to save back hotspots:', err);
    }
  }, [backHotspots]);

  useEffect(() => {
    try {
      localStorage.setItem('melostretch_front_hotspots', JSON.stringify(frontHotspots));
    } catch (err) {
      console.error('Failed to save front hotspots:', err);
    }
  }, [frontHotspots]);

  // Global Pointer Dragging logic for smooth node dragging
  useEffect(() => {
    if (!draggingNodeId || !isCalibrating) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = Math.round(((e.clientX - rect.left) / rect.width) * 380);
      const rawY = Math.round(((e.clientY - rect.top) / rect.height) * 480);

      const clampedX = Math.max(10, Math.min(370, rawX));
      const clampedY = Math.max(10, Math.min(470, rawY));

      if (view === 'back') {
        setBackHotspots(prev => prev.map(hs => 
          hs.id === draggingNodeId ? { ...hs, bodyX: clampedX, bodyY: clampedY, tagY: clampedY } : hs
        ));
      } else {
        setFrontHotspots(prev => prev.map(hs => 
          hs.id === draggingNodeId ? { ...hs, bodyX: clampedX, bodyY: clampedY, tagY: clampedY } : hs
        ));
      }
    };

    const handleGlobalPointerUp = () => {
      setDraggingNodeId(null);
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [draggingNodeId, isCalibrating, view]);

  // Handle AI Pain Search
  const handleSearchPain = async (queryToSearch?: string) => {
    const query = (queryToSearch || searchQuery).trim();
    if (!query) return;

    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/search-pain', {
        method: 'POST',
        headers: getGeminiRequestHeaders(),
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);

        // Check if matching nodes exist in other view and switch if current view has 0 matches
        const relatedNames: string[] = data.analysis.relatedMuscleNames || [];
        const currentSpots = view === 'back' ? backHotspots : frontHotspots;
        const otherSpots = view === 'back' ? frontHotspots : backHotspots;

        const currentMatches = currentSpots.filter(hs => relatedNames.some(rn => hs.name.includes(rn) || rn.includes(hs.name)));
        const otherMatches = otherSpots.filter(hs => relatedNames.some(rn => hs.name.includes(rn) || rn.includes(hs.name)));

        if (currentMatches.length === 0 && otherMatches.length > 0) {
          setView(view === 'back' ? 'front' : 'back');
        }
      } else {
        setAiError(data.error || 'AI 排查诊断失败，请检查网络或重试');
      }
    } catch (err: any) {
      console.error('AI search failed:', err);
      setAiError('网络或服务异常，请稍后重试');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Check if a hotspot matches current search/AI analysis
  const isNodeMatched = (hs: MuscleHotspot) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (hs.name.toLowerCase().includes(q) || hs.id.toLowerCase().includes(q)) {
        return true;
      }
    }
    if (aiAnalysis && aiAnalysis.relatedMuscleNames) {
      return aiAnalysis.relatedMuscleNames.some(rn => hs.name.includes(rn) || rn.includes(hs.name));
    }
    return false;
  };

  // Manual save trigger to confirm to user
  const handleSaveToLocalStorage = () => {
    localStorage.setItem('melostretch_back_hotspots', JSON.stringify(backHotspots));
    localStorage.setItem('melostretch_front_hotspots', JSON.stringify(frontHotspots));
    alert('✅ 已精准保存当前正面与背面所有肌肉点位！刷新页面或下次打开将保持您的最新调整。');
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm('确定恢复默认初始肌肉点位吗？')) {
      setBackHotspots(DEFAULT_BACK_HOTSPOTS);
      setFrontHotspots(DEFAULT_FRONT_HOTSPOTS);
      localStorage.removeItem('melostretch_back_hotspots');
      localStorage.removeItem('melostretch_front_hotspots');
    }
  };

  // Copy code format
  const handleCopyCode = () => {
    const spots = view === 'back' ? backHotspots : frontHotspots;
    const arrayName = view === 'back' ? 'BACK_HOTSPOTS' : 'FRONT_HOTSPOTS';
    const codeString = `const ${arrayName}: MuscleHotspot[] = [\n` +
      spots.map(s => `  { id: '${s.id}', name: '${s.name}', view: '${s.view}', side: '${s.side}', bodyX: ${s.bodyX}, bodyY: ${s.bodyY}, tagY: ${s.tagY} }`).join(',\n') +
      '\n];';

    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Dragging start
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (!isCalibrating) return;
    e.stopPropagation();
    e.preventDefault();
    setDraggingNodeId(id);
  };

  // Nudge adjustment helper
  const handleNudge = (id: string, axis: 'X' | 'Y' | 'tagY', delta: number) => {
    const updateFn = (spots: MuscleHotspot[]) => spots.map(hs => {
      if (hs.id !== id) return hs;
      if (axis === 'X') return { ...hs, bodyX: Math.max(10, Math.min(370, hs.bodyX + delta)) };
      if (axis === 'Y') {
        const newY = Math.max(10, Math.min(470, hs.bodyY + delta));
        return { ...hs, bodyY: newY, tagY: newY };
      }
      return { ...hs, tagY: Math.max(10, Math.min(470, hs.tagY + delta)) };
    });

    if (view === 'back') setBackHotspots(updateFn);
    else setFrontHotspots(updateFn);
  };

  const handleSelectHotspot = (id: string) => {
    if (isCalibrating) return; // ignore selection when in calibration mode
    const found = MUSCLES_LIST.find(m => m.id === id);
    if (found) {
      onSelectMuscle(found);
    }
  };

  const filteredMuscles = MUSCLES_LIST.filter(muscle => {
    const matchesCategory = activeCategory === 'all' || muscle.category === activeCategory;
    if (!matchesCategory) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const strain = MUSCLE_STRAINS[muscle.id];
      const nameMatch = muscle.name.toLowerCase().includes(q) || muscle.englishName.toLowerCase().includes(q);
      const causeMatch = strain?.causes.some(c => c.toLowerCase().includes(q));
      const symptomMatch = strain?.symptoms.some(s => s.toLowerCase().includes(q));
      
      const aiMatch = aiAnalysis?.relatedMuscleNames?.some(rn => muscle.name.includes(rn) || rn.includes(muscle.name));

      return nameMatch || causeMatch || symptomMatch || aiMatch;
    }

    return true;
  });

  const categories = [
    { id: 'all', label: '全部部位' },
    { id: 'head_neck', label: '肩颈头部' },
    { id: 'shoulder', label: '肩部' },
    { id: 'chest', label: '胸部' },
    { id: 'back', label: '上背部' },
    { id: 'lumbar', label: '腰部' },
    { id: 'arm_hand', label: '手肘手腕' },
    { id: 'hip', label: '臀部' },
    { id: 'leg', label: '腿部脚踝' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-100/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-4 top-2 text-white/10 text-8xl font-black pointer-events-none">
          🌱 🧭
        </div>

        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300 font-bold text-2xl shadow-2xs">
            🌱
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[11px] font-bold mb-1 border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>智能解剖探秘 · Melo 伴你轻松测不适</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">3D 视觉身体地图 ✨</h2>
            <p className="text-xs text-emerald-100 mt-0.5">点击绿色高亮节点或搜索不适症状，快速排查酸痛成因与舒缓方案~</p>
          </div>
        </div>

        {/* View Switcher & Calibration Toggle */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <div className="bg-black/20 p-1 rounded-full border border-white/20 flex items-center backdrop-blur-xs">
            <button
              onClick={() => setView('front')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                view === 'front'
                  ? 'bg-amber-400 text-amber-950 shadow-2xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              正面 🧍
            </button>
            <button
              onClick={() => setView('back')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                view === 'back'
                  ? 'bg-amber-400 text-amber-950 shadow-2xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              背面 🧘
            </button>
          </div>

          {/* Calibrate Mode Toggle Button */}
          <button
            onClick={() => setIsCalibrating(!isCalibrating)}
            className={`flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-full border transition-all cursor-pointer ${
              isCalibrating
                ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-sm animate-pulse'
                : 'bg-white/20 text-white hover:bg-white/30 border-white/20'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>{isCalibrating ? '退出拖拽微调' : '拖拽微调点位'}</span>
          </button>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 text-xs text-emerald-100 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-full transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>说明</span>
          </button>
        </div>
      </div>

      {/* Calibration Banner & Controls */}
      {isCalibrating && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 shadow-md animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500 text-white rounded-xl">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-amber-900">📍 点位自由拖拽微调模式已开启</h4>
                <p className="text-xs text-amber-800">直接在下方的身体图上<span className="font-bold underline">拖动绿色圆点</span>即可实时调整位置！</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '代码已复制!' : '复制TS坐标代码'}</span>
              </button>

              <button
                onClick={handleSaveToLocalStorage}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                保存我的位置
              </button>

              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-medium transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置默认</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Guide Modal */}
      {showGuide && (
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3 animate-fadeIn">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">如何使用身体地图与 AI 诊断搜索？</p>
            <p>1. 在搜索框输入任何不适（如："肩膀痛"、"低头脖子麻"、"久坐腰刺痛"），点击【AI 智能诊断排查】。</p>
            <p>2. AI 运动康复专家将深度解析该部位的<b>解剖学痛因</b>、<b>日常应对建议</b>，并为你推荐针对性舒缓动作！</p>
            <p>3. 地图上的对应肌肉节点将高亮发光，方便你精准定位并开始舒缓训练。</p>
          </div>
        </div>
      )}

      {/* Search & Category Filtering Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-emerald-100/80 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchPain();
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            <input
              type="text"
              placeholder="输入身体不适或酸痛症状（例如：肩膀酸痛、低头脖子麻、久坐腰刺痛、鼠标手）..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-gray-800 placeholder-gray-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setAiAnalysis(null);
                  setAiError(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-full transition-all"
              >
                清除
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isAiLoading || !searchQuery.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>AI 诊断排查中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI 诊断痛因与应对</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Quick Symptoms Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs pt-1">
          <span className="text-gray-400 text-[11px] whitespace-nowrap font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> 热门不适一键排查:
          </span>
          {PRESET_SYMPTOMS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => {
                setSearchQuery(symptom);
                handleSearchPain(symptom);
              }}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-full text-[11px] font-medium whitespace-nowrap transition-all"
            >
              {symptom}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 border-t border-emerald-50 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Pain Analysis Results Section */}
      {isAiLoading && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 shadow-sm flex flex-col items-center justify-center gap-3 text-center animate-pulse">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              AI 运动康复专家正在深入分析【{searchQuery}】...
            </h3>
            <p className="text-xs text-emerald-700 mt-1">
              正在解剖肌肉学逻辑，拆解不适痛因，生成工位姿势矫正与应对方案
            </p>
          </div>
        </div>
      )}

      {aiError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{aiError}</span>
          </div>
          <button
            onClick={() => handleSearchPain()}
            className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            重试
          </button>
        </div>
      )}

      {aiAnalysis && !isAiLoading && (
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 animate-fadeIn border border-emerald-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI 智能诊断分析报告
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {aiAnalysis.symptomTitle}
              </h3>
            </div>

            <button
              onClick={() => setAiAnalysis(null)}
              className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 self-start sm:self-center transition-all text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Causes & Relief Methods 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Pain Causes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                核心解剖学/肌肉痛因排查 ({aiAnalysis.painCauses?.length || 0})
              </h4>
              <div className="space-y-2.5 text-xs">
                {aiAnalysis.painCauses?.map((cause, idx) => (
                  <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
                    <p className="font-bold text-emerald-200 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {cause.title}
                    </p>
                    <p className="text-gray-300 text-[11px] leading-relaxed pl-5">
                      {cause.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Relief Methods */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-teal-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-300" />
                办公室日常应对与改善建议 ({aiAnalysis.reliefMethods?.length || 0})
              </h4>
              <ul className="space-y-2 text-xs">
                {aiAnalysis.reliefMethods?.map((method, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5 text-gray-200">
                    <Lightbulb className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-[11px]">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Related Muscle Badges */}
          {aiAnalysis.relatedMuscleNames?.length > 0 && (
            <div className="space-y-2 bg-black/20 p-4 rounded-2xl border border-white/10">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                关联肌肉节点（点击可直达肌肉图解与对应高亮）:
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {aiAnalysis.relatedMuscleNames.map((mName, idx) => {
                  const matchInDb = MUSCLES_LIST.find(m => m.name.includes(mName) || mName.includes(m.name));
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (matchInDb) onSelectMuscle(matchInDb);
                      }}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 group cursor-pointer"
                    >
                      <span>📍 {mName}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Recommended AI Exercises */}
          {aiAnalysis.recommendedExercises?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                为你推荐的即刻工位舒缓动作:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiAnalysis.recommendedExercises.map((ex, idx) => {
                  const isFav = favorites.includes(ex.id);
                  return (
                    <div
                      key={idx}
                      className="bg-white text-gray-900 rounded-2xl p-4 shadow-md space-y-2.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {ex.equipment || '无设备'} | {ex.suggestedSets}
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                            AI 定制
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-gray-900">{ex.name}</h5>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ex.benefits}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        {onToggleFavorite && (
                          <button
                            onClick={() => onToggleFavorite(ex.id)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                              isFav ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                            }`}
                            title={isFav ? '已在我的方案' : '加入我的方案'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        )}

                        {onStartExercise && (
                          <button
                            onClick={() => onStartExercise(ex)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>立即跟练</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Body Map Canvas */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100/80 relative flex flex-col items-center">
        
        {/* Interactive Container with 3D Character Image + Overlay Hotspot Nodes */}
        <div className="relative w-full max-w-xl aspect-[380/480] my-2 select-none rounded-2xl bg-radial from-emerald-50/60 via-white to-gray-50/30 p-1 border border-emerald-50/80">
          
          {/* Background Soft 3D Render Character Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
            <img
              src={currentImage}
              alt={view === 'back' ? 'MeloStretch 身体地图 背面' : 'MeloStretch 身体地图 正面'}
              loading="eager"
              decoding="async"
              // @ts-ignore
              fetchPriority="high"
              onLoad={() => setIsImgLoaded(true)}
              className={`h-full w-auto object-contain drop-shadow-md transition-all duration-300 ${
                isImgLoaded ? 'opacity-100 scale-100' : 'opacity-30 blur-xs scale-98'
              }`}
            />

            {!isImgLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-3xs rounded-2xl z-20">
                <div className="px-3.5 py-2 bg-emerald-800/90 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 animate-pulse border border-emerald-400/30">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>🌱 3D 肌肉解剖模型加载中...</span>
                </div>
              </div>
            )}
          </div>

          {/* SVG Connector Lines Overlay */}
          <svg
            ref={svgRef}
            viewBox="0 0 380 480"
            className={`absolute inset-0 w-full h-full z-10 ${isCalibrating ? 'cursor-crosshair' : 'pointer-events-none'}`}
          >
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Connecting Lines between Body Hotspots and Side Label Pills */}
            {activeHotspots.map((hs) => {
              const isSelected = selectedMuscleId === hs.id;
              const isHovered = hoveredMuscleId === hs.id;
              const isDragging = draggingNodeId === hs.id;
              const isMatched = isNodeMatched(hs);
              const isActive = isSelected || isHovered || isDragging || isMatched;

              const lineEndX = hs.side === 'left' ? 70 : 310;
              const lineEndY = hs.tagY;

              return (
                <g key={`line_${hs.id}`}>
                  <line
                    x1={hs.bodyX}
                    y1={hs.bodyY}
                    x2={lineEndX}
                    y2={lineEndY}
                    stroke={isCalibrating ? '#f59e0b' : isMatched ? '#d97706' : isActive ? '#047857' : '#10B981'}
                    strokeWidth={isMatched ? 2.5 : isActive ? 2 : 1}
                    strokeDasharray={isCalibrating ? '3 3' : 'none'}
                    opacity={isActive ? 0.95 : 0.65}
                  />
                  <circle
                    cx={lineEndX}
                    cy={lineEndY}
                    r={isActive ? 3.5 : 2}
                    fill={isCalibrating ? '#f59e0b' : isMatched ? '#d97706' : isActive ? '#047857' : '#10B981'}
                  />
                </g>
              );
            })}

            {/* Interactive Hotspot Nodes on Body */}
            {activeHotspots.map((hs) => {
              const isSelected = selectedMuscleId === hs.id;
              const isHovered = hoveredMuscleId === hs.id;
              const isDragging = draggingNodeId === hs.id;
              const isMatched = isNodeMatched(hs);
              const isActive = isSelected || isHovered || isDragging || isMatched;

              return (
                <g
                  key={`node_${hs.id}`}
                  className="cursor-pointer pointer-events-auto group touch-none"
                  onClick={() => handleSelectHotspot(hs.id)}
                  onMouseEnter={() => setHoveredMuscleId(hs.id)}
                  onMouseLeave={() => setHoveredMuscleId(null)}
                  onPointerDown={(e) => handlePointerDown(hs.id, e)}
                >
                  {/* Outer Pulsing Glow Circle */}
                  <circle
                    cx={hs.bodyX}
                    cy={hs.bodyY}
                    r={isMatched ? 26 : isDragging ? 22 : isActive ? 18 : isCalibrating ? 12 : 10}
                    fill={isMatched ? '#f59e0b' : isCalibrating ? '#f59e0b' : '#10B981'}
                    opacity={isMatched ? 0.7 : isDragging ? 0.6 : isActive ? 0.45 : 0.25}
                    className={isActive && !isCalibrating ? 'animate-ping' : ''}
                  />

                  {/* Ring Border */}
                  <circle
                    cx={hs.bodyX}
                    cy={hs.bodyY}
                    r={isDragging ? 12 : isActive ? 9 : 6.5}
                    fill="white"
                    stroke={isMatched ? '#d97706' : isCalibrating ? '#d97706' : isActive ? '#047857' : '#059669'}
                    strokeWidth={isMatched ? 3 : isCalibrating ? 3 : isActive ? 2.5 : 1.5}
                    filter="url(#shadow)"
                  />

                  {/* Inner Core Green / Amber Dot */}
                  <circle
                    cx={hs.bodyX}
                    cy={hs.bodyY}
                    r={isDragging ? 6 : isActive ? 5 : 3.5}
                    fill={isMatched ? '#d97706' : isCalibrating ? '#d97706' : isActive ? '#047857' : '#10B981'}
                  />

                  {/* Coordinate Label in Calibration Mode */}
                  {isCalibrating && (
                    <g transform={`translate(${hs.bodyX}, ${hs.bodyY - 14})`}>
                      <rect
                        x="-24"
                        y="-10"
                        width="48"
                        height="14"
                        rx="4"
                        fill="#1f2937"
                        opacity="0.85"
                      />
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {hs.bodyX},{hs.bodyY}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Overlay Pills for Muscle Names on Left & Right */}
          {activeHotspots.map((hs) => {
            const isSelected = selectedMuscleId === hs.id;
            const isHovered = hoveredMuscleId === hs.id;
            const isDragging = draggingNodeId === hs.id;
            const isMatched = isNodeMatched(hs);
            const isActive = isSelected || isHovered || isDragging || isMatched;

            const isLeft = hs.side === 'left';
            const topPct = (hs.tagY / 480) * 100;

            return (
              <button
                key={`tag_${hs.id}`}
                onClick={() => handleSelectHotspot(hs.id)}
                onMouseEnter={() => setHoveredMuscleId(hs.id)}
                onMouseLeave={() => setHoveredMuscleId(null)}
                style={{
                  top: `${topPct}%`,
                  ...(isLeft ? { left: '8px' } : { right: '8px' })
                }}
                className={`absolute -translate-y-1/2 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 border flex items-center gap-1.5 shadow-2xs z-20 cursor-pointer ${
                  isCalibrating
                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    : isMatched
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105 ring-2 ring-amber-300/60'
                    : isActive
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105 ring-2 ring-emerald-300/50'
                    : 'bg-white/95 text-gray-800 border-emerald-200/90 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-400'
                }`}
              >
                {isLeft && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isCalibrating || isMatched ? 'bg-amber-300' : isActive ? 'bg-white' : 'bg-emerald-500'}`} />
                )}
                <span>{hs.name}</span>
                {isMatched && <span className="text-[10px] font-bold">🎯</span>}
                {!isLeft && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isCalibrating || isMatched ? 'bg-amber-300' : isActive ? 'bg-white' : 'bg-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Fine-Tuning Stepper Controls Table in Calibration Mode */}
        {isCalibrating && (
          <div className="w-full mt-4 bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>{view === 'back' ? '背面' : '正面'}肌肉微调点位精确控制台</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {activeHotspots.map((hs) => (
                <div
                  key={`stepper_${hs.id}`}
                  className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <span className="font-bold text-gray-800 truncate w-20">{hs.name}</span>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {/* X adjustment */}
                    <div className="flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded-md">
                      <span className="text-gray-400 font-mono">X:</span>
                      <button onClick={() => handleNudge(hs.id, 'X', -2)} className="text-amber-700 hover:bg-amber-200 px-1 rounded font-bold">-</button>
                      <span className="font-mono w-6 text-center font-bold text-gray-700">{hs.bodyX}</span>
                      <button onClick={() => handleNudge(hs.id, 'X', 2)} className="text-amber-700 hover:bg-amber-200 px-1 rounded font-bold">+</button>
                    </div>

                    {/* Y adjustment */}
                    <div className="flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded-md">
                      <span className="text-gray-400 font-mono">Y:</span>
                      <button onClick={() => handleNudge(hs.id, 'Y', -2)} className="text-amber-700 hover:bg-amber-200 px-1 rounded font-bold">-</button>
                      <span className="font-mono w-6 text-center font-bold text-gray-700">{hs.bodyY}</span>
                      <button onClick={() => handleNudge(hs.id, 'Y', 2)} className="text-amber-700 hover:bg-amber-200 px-1 rounded font-bold">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Tip Banner */}
        <div className="w-full mt-4 bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-900 shadow-2xs">
          <span className="text-base">💡</span>
          <span className="font-medium">
            {isCalibrating
              ? '按住并拖拽图上的任意圆点即可精准重设肌肉位置，满意后点击右上角【保存】或【复制代码】！'
              : '点击身体的绿色节点，或在上方搜索症状体验 AI 智能痛因排查与工位舒缓'}
          </span>
        </div>
      </div>

      {/* Filtered Muscle Cards Quick Browser */}
      {filteredMuscles.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-emerald-100/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>部位肌肉深度探索 ({filteredMuscles.length})</span>
            </h3>
            <span className="text-xs text-gray-400">点击卡片直达肌肉解析与动作指导</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredMuscles.map((m) => {
              const isSelected = selectedMuscleId === m.id;
              return (
                <button
                  key={`list_${m.id}`}
                  onClick={() => onSelectMuscle(m)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 group cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                      : 'bg-gray-50/60 border-gray-200/80 hover:bg-emerald-50/50 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">
                      {m.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <span className="text-[11px] text-gray-500 line-clamp-1">
                    {m.locationText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
