export default function ApplyBanner({ visible }) {
  return (
    <div
      className={`bg-frame-fill border border-frame-border rounded-[12px] w-[192px] p-[6px] flex items-center justify-center transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[8px] pointer-events-none'
      }`}
    >
      <p className="text-[12px] leading-[15px] font-normal text-apply-text whitespace-nowrap">
        Apply when you are ready
      </p>
    </div>
  )
}
