export interface FormItemOption {
  value: string;
}

export interface FormQuestionItem {
  title: string;
  description?: string;
  type: 'TEXT' | 'RADIO' | 'CHECKBOX';
  options?: string[];
  required?: boolean;
}

export interface GoogleDriveFormFile {
  id: string;
  name: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export interface GoogleFormDetails {
  formId: string;
  info?: {
    title: string;
    documentTitle?: string;
    description?: string;
  };
  responderUri?: string;
  items?: any[];
}

export interface GoogleFormResponsesResponse {
  responses?: Array<{
    responseId: string;
    createTime: string;
    lastSubmittedTime: string;
    answers?: Record<string, {
      questionId: string;
      textAnswers?: {
        answers: Array<{ value: string }>;
      };
    }>;
  }>;
  totalResponses?: number;
}

export const listFormsFromDrive = async (accessToken: string): Promise<GoogleDriveFormFile[]> => {
  const query = encodeURIComponent("mimeType = 'application/vnd.google-apps.form' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,createdTime,modifiedTime)&orderBy=modifiedTime%20desc&pageSize=30`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Google Drive formları listelenemedi.');
  }

  const data = await response.json();
  return data.files || [];
};

export const getFormDetails = async (accessToken: string, formId: string): Promise<GoogleFormDetails> => {
  const url = `https://forms.googleapis.com/v1/forms/${formId}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Form detayları alınamadı.');
  }

  return await response.json();
};

export const getFormResponses = async (accessToken: string, formId: string): Promise<GoogleFormResponsesResponse> => {
  const url = `https://forms.googleapis.com/v1/forms/${formId}/responses`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Form yanıtları alınamadı.');
  }

  return await response.json();
};

export const createGoogleForm = async (
  accessToken: string,
  title: string,
  documentTitle?: string
): Promise<GoogleFormDetails> => {
  const url = 'https://forms.googleapis.com/v1/forms';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title,
        documentTitle: documentTitle || title,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Yeni Google Form oluşturulamadı.');
  }

  return await response.json();
};

export const addQuestionsToGoogleForm = async (
  accessToken: string,
  formId: string,
  questions: FormQuestionItem[]
): Promise<any> => {
  const requests = questions.map((q, index) => {
    let questionTypeObj: any = {};

    if (q.type === 'TEXT') {
      questionTypeObj = { textQuestion: {} };
    } else if (q.type === 'RADIO' || q.type === 'CHECKBOX') {
      const options = (q.options || ['Evet', 'Hayır']).map((opt) => ({ value: opt }));
      questionTypeObj = {
        choiceQuestion: {
          type: q.type === 'RADIO' ? 'RADIO' : 'CHECKBOX',
          options,
          shuffle: false,
        },
      };
    }

    return {
      createItem: {
        item: {
          title: q.title,
          description: q.description || '',
          questionItem: {
            question: {
              required: q.required ?? false,
              ...questionTypeObj,
            },
          },
        },
        location: {
          index,
        },
      },
    };
  });

  const url = `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Sorular forma eklenirken hata oluştu.');
  }

  return await response.json();
};
