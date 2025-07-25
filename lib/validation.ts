import { FormErrors, InsuranceFormData } from "./types/insurance"

export const validateInsuranceForm = (data: InsuranceFormData): FormErrors => {
  const errors: FormErrors = {}

  if (!data.documment_owner_full_name?.trim() || data.documment_owner_full_name.length < 3) {
    errors.documment_owner_full_name = "الاسم يجب أن يكون أكثر من 3 حروف"
  }

  if (data.insurance_purpose === "renewal") {
    if (!data.owner_identity_number || !/^[\d٠-٩]{10}$/.test(data.owner_identity_number)) {
      errors.owner_identity_number = "رقم الهوية يجب أن يكون 10 أرقام"
    }
  } else {
    if (!data.buyer_identity_number || !/^[\d٠-٩]{10}$/.test(data.buyer_identity_number)) {
      errors.buyer_identity_number = "رقم هوية المشتري يجب أن يكون 10 أرقام"
    }
    if (!data.seller_identity_number || !/^[\d٠-٩]{10}$/.test(data.seller_identity_number)) {
      errors.seller_identity_number = "رقم هوية البائع يجب أن يكون 10 أرقام"
    }
  }

  if (data.vehicle_type === "registration") {
    if (!data.phone || !/^(05|٠٥)[\d٠-٩]{8}$/.test(data.phone)) {
      errors.phone = "رقم الهاتف يجب أن يبدأ بـ 05 ويكون 10 أرقام"
    }
    if (!data.serial_number?.trim()) {
      errors.serial_number = "الرقم التسلسلي للمركبة مطلوب"
    }
  } else if (data.vehicle_type === "customs" && data.insurance_purpose !== "property-transfer") {
    if (!data.vehicle_manufacture_number?.trim()) {
      errors.vehicle_manufacture_number = "رقم صنع المركبة مطلوب"
    }
    if (!data.customs_code?.trim()) {
      errors.customs_code = "رقم البطاقة الجمركية مطلوب"
    }
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = "يجب الموافقة على الشروط والأحكام"
  }

  return errors
}

