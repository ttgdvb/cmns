export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  isUserUploaded?: boolean;
}

export interface Coupon {
  id: string;
  text: string;
  color: string;
  description: string;
}

export interface LoveLetterRequest {
  senderName: string;
  receiverName: string;
  relationshipLength: string;
  girlTraits: string;
  memoriesToInclude: string;
  tone: 'poetic' | 'sweet' | 'humorous' | 'deep';
  format: 'letter' | 'poem';
}
