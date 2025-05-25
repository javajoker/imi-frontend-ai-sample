import {
  api,
  shouldUseMockData,
  mockDelay,
  buildPaginationParams,
} from "./apiClient";
import {
  IPAsset,
  LicenseTerms,
  LicenseApplication,
  IPRegistrationForm,
  LicenseApplicationForm,
  PaginationParams,
  FilterParams,
  APIResponse,
} from "../types";
import {
  mockIPAssets,
  mockLicenseTerms,
  mockLicenseApplications,
  getIPAssetsByCreator,
  getLicenseApplicationsForCreator,
  getLicenseApplicationsByApplicant,
} from "../data/mockData";

export const ipService = {
  // Get all IP assets with pagination and filters
  getIPAssets: async (
    pagination: PaginationParams = {},
    filters: FilterParams = {}
  ): Promise<APIResponse<IPAsset[]>> => {
    if (shouldUseMockData()) {
      await mockDelay();

      let filteredAssets = [...mockIPAssets];

      // Apply filters
      if (filters.category) {
        filteredAssets = filteredAssets.filter((asset) =>
          asset.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }

      if (filters.search) {
        filteredAssets = filteredAssets.filter(
          (asset) =>
            asset.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
            asset.description
              .toLowerCase()
              .includes(filters.search!.toLowerCase())
        );
      }

      if (filters.status) {
        filteredAssets = filteredAssets.filter(
          (asset) => asset.status === filters.status
        );
      }

      // Apply sorting
      if (pagination.sortBy) {
        filteredAssets.sort((a, b) => {
          const aValue = (a as any)[pagination.sortBy!];
          const bValue = (b as any)[pagination.sortBy!];

          if (pagination.sortOrder === "desc") {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Apply pagination
      const page = pagination.page || 1;
      const limit = pagination.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedAssets,
        pagination: {
          page,
          limit,
          total: filteredAssets.length,
          totalPages: Math.ceil(filteredAssets.length / limit),
        },
      };
    }

    const params = {
      ...buildPaginationParams(
        pagination.page,
        pagination.limit,
        pagination.sortBy,
        pagination.sortOrder
      ),
      ...filters,
    };

    return await api.get<IPAsset[]>("/ip-assets", params);
  },

  // Get single IP asset by ID
  getIPAsset: async (id: string): Promise<IPAsset> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const asset = mockIPAssets.find((a) => a.id === id);
      if (!asset) {
        throw new Error("IP Asset not found");
      }
      return asset;
    }

    const response = await api.get<IPAsset>(`/ip-assets/${id}`);
    return response.data!;
  },

  // Create new IP asset
  createIPAsset: async (ipData: IPRegistrationForm): Promise<IPAsset> => {
    if (shouldUseMockData()) {
      await mockDelay(1000);

      const newAsset: IPAsset = {
        id: Date.now().toString(),
        creator_id: "1", // Current user ID would come from auth context
        title: ipData.title,
        description: ipData.description,
        category: ipData.category,
        content_type: ipData.content_type,
        file_urls: ["/api/placeholder/400/300"], // Mock file URLs
        metadata: {
          tags: ipData.tags,
        },
        verification_status: "pending",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stats: {
          views: 0,
          license_applications: 0,
          active_licenses: 0,
        },
      };

      return newAsset;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("title", ipData.title);
    formData.append("description", ipData.description);
    formData.append("category", ipData.category);
    formData.append("content_type", ipData.content_type);
    formData.append("tags", JSON.stringify(ipData.tags));
    formData.append("license_terms", JSON.stringify(ipData.license_terms));

    ipData.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await api.upload<IPAsset>("/ip-assets", formData);
    return response.data!;
  },

  // Update IP asset
  updateIPAsset: async (
    id: string,
    updates: Partial<IPAsset>
  ): Promise<IPAsset> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const asset = mockIPAssets.find((a) => a.id === id);
      if (!asset) {
        throw new Error("IP Asset not found");
      }

      return { ...asset, ...updates, updated_at: new Date().toISOString() };
    }

    const response = await api.put<IPAsset>(`/ip-assets/${id}`, updates);
    return response.data!;
  },

  // Delete IP asset
  deleteIPAsset: async (id: string): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.delete(`/ip-assets/${id}`);
  },

  // Get license terms for an IP asset
  getLicenseTerms: async (ipAssetId: string): Promise<LicenseTerms[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return mockLicenseTerms.filter((term) => term.ip_asset_id === ipAssetId);
    }

    const response = await api.get<LicenseTerms[]>(
      `/ip-assets/${ipAssetId}/licenses`
    );
    return response.data!;
  },

  // Create license terms for an IP asset
  createLicenseTerms: async (
    ipAssetId: string,
    termsData: Omit<LicenseTerms, "id" | "ip_asset_id" | "created_at">
  ): Promise<LicenseTerms> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const newTerms: LicenseTerms = {
        id: Date.now().toString(),
        ip_asset_id: ipAssetId,
        ...termsData,
        created_at: new Date().toISOString(),
      };

      return newTerms;
    }

    const response = await api.post<LicenseTerms>(
      `/ip-assets/${ipAssetId}/licenses`,
      termsData
    );
    return response.data!;
  },

  // Get license applications for creator
  getLicenseApplicationsForCreator: async (
    creatorId: string
  ): Promise<LicenseApplication[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return getLicenseApplicationsForCreator(creatorId);
    }

    const response = await api.get<LicenseApplication[]>("/licenses/incoming", {
      creator_id: creatorId,
    });
    return response.data!;
  },

  // Get license applications by applicant
  getLicenseApplicationsByApplicant: async (
    applicantId: string
  ): Promise<LicenseApplication[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return getLicenseApplicationsByApplicant(applicantId);
    }

    const response = await api.get<LicenseApplication[]>(
      "/licenses/applications",
      { applicant_id: applicantId }
    );
    return response.data!;
  },

  // Apply for license
  applyForLicense: async (
    ipAssetId: string,
    licenseTermsId: string,
    applicationData: LicenseApplicationForm
  ): Promise<LicenseApplication> => {
    if (shouldUseMockData()) {
      await mockDelay(1000);

      const newApplication: LicenseApplication = {
        id: Date.now().toString(),
        ip_asset_id: ipAssetId,
        applicant_id: "2", // Current user ID would come from auth context
        license_terms_id: licenseTermsId,
        application_data: applicationData,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return newApplication;
    }

    const response = await api.post<LicenseApplication>("/licenses/apply", {
      ip_asset_id: ipAssetId,
      license_terms_id: licenseTermsId,
      application_data: applicationData,
    });
    return response.data!;
  },

  // Approve license application
  approveLicenseApplication: async (
    applicationId: string
  ): Promise<LicenseApplication> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const application = mockLicenseApplications.find(
        (app) => app.id === applicationId
      );
      if (!application) {
        throw new Error("License application not found");
      }

      return {
        ...application,
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: "1", // Current user ID
        updated_at: new Date().toISOString(),
      };
    }

    const response = await api.put<LicenseApplication>(
      `/licenses/${applicationId}/approve`
    );
    return response.data!;
  },

  // Reject license application
  rejectLicenseApplication: async (variables: {
    applicationId: string;
    reason: string;
  }): Promise<LicenseApplication> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const application = mockLicenseApplications.find(
        (app) => app.id === variables.applicationId
      );
      if (!application) {
        throw new Error("License application not found");
      }

      return {
        ...application,
        status: "rejected",
        rejection_reason: variables.reason,
        updated_at: new Date().toISOString(),
      };
    }

    const response = await api.put<LicenseApplication>(
      `/licenses/${variables.applicationId}/reject`,
      { reason: variables.reason }
    );
    return response.data!;
  },

  // Revoke license
  revokeLicense: async (licenseId: string, reason: string): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.put(`/licenses/${licenseId}/revoke`, { reason });
  },

  // Verify license
  verifyLicense: async (
    licenseId: string
  ): Promise<{ valid: boolean; details?: any }> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const application = mockLicenseApplications.find(
        (app) => app.id === licenseId
      );
      return {
        valid: application?.status === "approved",
        details: application,
      };
    }

    const response = await api.get<{ valid: boolean; details?: any }>(
      `/licenses/${licenseId}/verify`
    );
    return response.data!;
  },

  // Get user's IP assets
  getUserIPAssets: async (userId: string): Promise<IPAsset[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return getIPAssetsByCreator(userId);
    }

    const response = await api.get<IPAsset[]>(`/users/${userId}/ip-assets`);
    return response.data!;
  },
};
