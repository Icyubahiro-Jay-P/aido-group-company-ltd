// border spining loading component
const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="w-5 h-5 border-4 border-blue-300 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};
export default Loading;