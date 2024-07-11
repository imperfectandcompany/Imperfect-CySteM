import { FunctionalComponent } from 'preact';

interface SubmitButtonProps {
  progress: number;
  loading: boolean;
  onClick: () => void;
}

const SubmitButton: FunctionalComponent<SubmitButtonProps> = ({ progress, loading, onClick }) => {
  const isDisabled = progress !== 100 || loading;

  return (
    <button
      className={`relative bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out ${isDisabled ? 'button-disabled' : ''}`}
      type="submit"
      disabled={isDisabled}
      onClick={onClick}
      aria-disabled={isDisabled}
    >
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      ) : null}
      Submit Request
    </button>
  );
};

export default SubmitButton;