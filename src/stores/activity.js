import Api from '@/stores/api';
import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const useActivityStore = defineStore('activities', () => {
  const associations = {
    belognsTo: new Map(
      [
        ["organizingOrganization", "a"],
        ["partnerOrganization", "b"],
        ["beneficiaryDetail", "c"] // hasOne
      ]
    ),
    hasMany: new Map(
      [
        ["activityCareers", null],
        ["activityWeeks", null]
      ]
    )
  }
  const defaultRecord = {
    id: null,
    name: null,
    activity_type_id: null,
    status: null,
    address: null,
    virtual_participation: false,
    organizing_organization_id: null,
    parther_organization_id: null,
    project_link: null,
    hours: null,
    ods_vinculation: null,
    institutional_program: null,
    institutional_extension_line: null,
    start_date: null,
    end_date: null,
    beneficiaryDetail: {
      numberOfMen: 0,
      numberOfWomen: 0
    },
    activityCareers: [],
    errors: {}
  };

  const apiConfig = {
    endpoint: "activities",
    recordKey: "activity",
    recordListKey: "activities"
  };

  const data = reactive({
    record: { ...defaultRecord },
    recordList: {
      records: new Map(),
      meta: {
        perPage: 0,
        totalPages: 0,
        totalObjects: 0
      }
    }
  });

  const totalBeneficiaries = computed(() => {
    let numberOfMen = parseInt(data.record.beneficiaryDetail.numberOfMen)
    let numberOfWomen = parseInt(data.record.beneficiaryDetail.numberOfWomen)

    if (isNaN(numberOfMen) || isNaN(numberOfWomen)) {
      return 0
    }

    return numberOfMen + numberOfWomen
  });

  const api = new Api(data, associations, apiConfig);

  function resetRecord() {
    this.data.record = { ...defaultRecord };
  }

  return { data, api, resetRecord, totalBeneficiaries }
})
