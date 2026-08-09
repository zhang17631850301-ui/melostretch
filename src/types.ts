export type BodyView = 'front' | 'back';

export type BodyCategory = 
  | 'head_neck'   // 头部与肩颈
  | 'shoulder'    // 肩部
  | 'chest'       // 胸部
  | 'back'        // 背后背
  | 'lumbar'      // 腰部
  | 'arm_hand'    // 手臂与手腕
  | 'hip'         // 臀部
  | 'leg';        // 腿部

export interface MuscleInfo {
  id: string;             // e.g. "upper_trapezius"
  name: string;           // e.g. "斜方肌上束"
  englishName: string;    // e.g. "Upper Trapezius"
  category: BodyCategory;
  categoryName: string;   // e.g. "肩颈区域"
  view: BodyView | 'both';// 正面、背面、或双面皆可看到
  svgPathId: string;      // ID for matching interactive SVG path
  description: string;    // 肌肉位置与基本功能说明
  locationText: string;   // 解剖位置简化描述
}

export interface MuscleStrainInfo {
  muscleId: string;
  causes: string[];       // 常见办公劳损原因
  symptoms: string[];     // 用户可能感觉（症状描述）
  severityTip: string;    // 舒缓建议或自我排查小贴士
}

export interface ExerciseStep {
  stepNumber: number;
  title: string;
  detail: string;
}

export interface Exercise {
  id: string;             // e.g. "ex_neck_side_stretch"
  name: string;           // e.g. "坐姿颈部侧向拉伸"
  targetMuscleIds: string[]; // 主拉伸肌肉与辅拉伸肌肉
  primaryMuscleName: string;
  durationSeconds: number;   // 建议练习时长（秒）
  suggestedSets: string;     // 建议组数（如 2组 x 30秒）
  difficulty: '轻松' | '初级' | '进阶';
  equipment: '无设备' | '办公椅' | '墙面' | '办公桌' | '站立徒手' | '站立/靠墙';
  benefits: string;          // 动作益处
  steps: ExerciseStep[];     // 步骤细解
  cautions: string[];        // 注意事项
  iconName: string;          // Icon hint for illustration
  isAiGenerated?: boolean;   // 是否为AI联网/智能拓展生成的动作
}

export interface MuscleWithDetails extends MuscleInfo {
  strainInfo?: MuscleStrainInfo;
  exercises: Exercise[];
}

export interface SolutionRoutine {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  category: string;
  description: string;
  icon: string;
  tagColor: string;
  exerciseIds: string[];
}

export interface UserLog {
  id: string;
  timestamp: number;
  dateStr: string;
  exerciseId: string;
  exerciseName: string;
  durationSeconds: number;
  muscleName: string;
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  totalSeconds: number;
  todaySessions: number;
  todayMinutes: number;
  todaySeconds: number;
  streakDays: number;
  lastActiveDate: string;
}
