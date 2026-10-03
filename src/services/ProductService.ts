import demoData from "../data/demo-data.json";

export type GenericResponseModel = {
  status: boolean;
  message?: string | null;
  data?: object[] | null;
};

export type InquiryResponse = {
  inquiryID: string;
  inquiryDate: string;
  companyName: string;
  contactName: string;
  contactNumber: string;
  email: string;
  socialAccount: string;
  address: string;
  source: string;
  salesPerson: string;
  productID: string;
  status: number;
  targetDate?: string | null;
  product: {
    productId: string;
    targetPrice?: number | null;
    targetDate?: string | null;
    remarks?: string | null;
    productType?: string | null;
    quantity?: number | string | null;
  } | null;
};

export type GetInquiriesResponse = {
  status: boolean;
  message?: string | null;
  data: InquiryResponse[] | null;
};

export type GetInquiryByIdResponse = {
  status: boolean;
  message?: string | null;
  data: InquiryResponse | null;
};

export type SaveInquiryRequest = {
  inquiryID: string;
  inquiryDate: string;
  companyName: string;
  contactName: string;
  contactNumber: string;
  email: string;
  socialAccount: string;
  address: string;
  source: string;
  salesPerson: string;
  status: number;
  productID: string;
  productId: string;
  productType: string;
  quantity: number;
  targetPrice: number;
  targetDate: string;
  remarks: string;
};

export class ProductService {
  private readonly inquiriesStorageKey = "afhim_demo_inquiries";

  private readInquiries(): InquiryResponse[] {
    const storedInquiries = localStorage.getItem(this.inquiriesStorageKey);
    if (storedInquiries) {
      try {
        const parsed = JSON.parse(storedInquiries) as unknown;
        if (Array.isArray(parsed)) return parsed as InquiryResponse[];
      } catch {
        localStorage.removeItem(this.inquiriesStorageKey);
      }
    }

    return demoData.inquiries;
  }

  async getInquiries(status = 1): Promise<GetInquiriesResponse> {
    const inquiries = this.readInquiries();
    return {
      status: true,
      data: status === 0 ? inquiries : inquiries.filter((inquiry) => inquiry.status === status),
    };
  }

  async getInquiry(inquiryId: string): Promise<GetInquiryByIdResponse> {
    const inquiry = this.readInquiries().find((entry) => entry.inquiryID === inquiryId);
    return inquiry
      ? { status: true, data: inquiry }
      : { status: false, message: "The requested inquiry was not found.", data: null };
  }

  async saveInquiry(payload: SaveInquiryRequest): Promise<GenericResponseModel> {
    const inquiry: InquiryResponse = {
      inquiryID: payload.inquiryID,
      inquiryDate: payload.inquiryDate,
      companyName: payload.companyName,
      contactName: payload.contactName,
      contactNumber: payload.contactNumber,
      email: payload.email,
      socialAccount: payload.socialAccount,
      address: payload.address,
      source: payload.source,
      salesPerson: payload.salesPerson,
      productID: payload.productID,
      status: payload.status,
      targetDate: payload.targetDate,
      product: {
        productId: payload.productId,
        targetPrice: payload.targetPrice,
        targetDate: payload.targetDate,
        remarks: payload.remarks,
        productType: payload.productType,
        quantity: payload.quantity,
      },
    };
    const inquiries = this.readInquiries();
    const existingIndex = inquiries.findIndex((entry) => entry.inquiryID === payload.inquiryID);

    if (existingIndex === -1) inquiries.unshift(inquiry);
    else inquiries[existingIndex] = inquiry;

    localStorage.setItem(this.inquiriesStorageKey, JSON.stringify(inquiries));
    return { status: true, message: "Inquiry saved locally." };
  }
}

export const productService = new ProductService();
