import { FC } from "react";

interface BankVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankVerificationModal: FC<BankVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-center space-y-6">
        <img
          src="/icons/mada.svg"
          alt="Bank Logo"
          className="mx-auto w-[14rem] h-auto object-contain"
        />

        <div className="space-y-4 text-[#146394]">
          <p className="font-semibold">
            يرجى التوجه إلى تطبيق المصرف الخاص بك والموافقة على طلب إضافة
            البطاقة
          </p>
          <p>ادخل الرمز المرسل لتأكيد العملية</p>
          <p className="opacity-60">سيتم الإرسال خلال أقل من ثلاث دقائق</p>
        </div>

        <button
          onClick={onClose}
          className="bg-[#146394] text-white px-8 py-3 rounded-lg font-semibold transition-all hover:bg-[#0f4c70] transform hover:scale-[0.98]"
        >
          فهمت
        </button>
      </div>
    </div>
  );
};
