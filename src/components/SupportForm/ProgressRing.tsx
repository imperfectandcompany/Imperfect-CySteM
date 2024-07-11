import { FunctionalComponent } from 'preact';

interface ProgressRingProps {
  progress: number;
}

const ProgressRing: FunctionalComponent<ProgressRingProps> = ({ progress }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="mb-4 flex justify-center items-center relative">
      <svg className="progress-ring" width="60" height="60" aria-label={`Form completion progress: ${Math.round(progress)}%`}>
        <circle
          className="progress-ring__circle"
          stroke="gray"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="30"
          cy="30"
        />
        <circle
          className="progress-ring__circle text-indigo-600"
          stroke="rgb(79, 70, 229)"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="30"
          cy="30"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.35s', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className="absolute text-xs font-semibold">{`${Math.round(progress)}%`}</span>
    </div>
  );
};

export default ProgressRing;