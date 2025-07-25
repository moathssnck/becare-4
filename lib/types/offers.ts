interface ExtraFeature {
    content: string
    price: number
  }
  
  interface ExtraExpense {
    reason: string
    price: number
  }
  
  export interface Offer {
    id: string
    companyId: string
    name: string
    type: string
    main_price: number
    extra_features: ExtraFeature[]
    extra_expenses: ExtraExpense[]
  }
  
  