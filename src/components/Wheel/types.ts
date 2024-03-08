export interface WheelProps {
    width: number;
    height: number;
    changePointsRef: React.MutableRefObject<() => void>;
    hide: boolean;
}