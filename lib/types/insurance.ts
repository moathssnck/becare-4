export interface InsuranceFormData {
    insurance_purpose: "renewal" | "property-transfer"
    vehicle_type: "registration" | "customs"
    documment_owner_full_name: string
    owner_identity_number?: string
    buyer_identity_number?: string
    seller_identity_number?: string
    phone?: string
    serial_number?: string
    vehicle_manufacture_number?: string
    customs_code?: string
    agreeToTerms: boolean
  }
  
  export type FormErrors = Partial<Record<keyof InsuranceFormData, string>>
  
  