const response = {
  formData: {
    fullName: {
      first: 'Mark',
      last: 'Webb',
      suffix: 'Jr.',
    },
    dateOfBirth: '1950-10-04',
    applicantAddress: {
      street: '123 Faker Street',
      city: 'Bogusville',
      state: 'GA',
      country: 'USA',
      postalCode: '30058',
    },
    contactPhone: '4445551212',
    contactEmail: 'test2@test1.net',
    periodsOfService: [
      {
        serviceBranch: 'Air Force',
        dateRange: {
          from: '2001-03-21',
          to: '2014-07-21',
        },
      },
      {
        serviceBranch: 'Marine Corps',
        dateRange: {
          from: '2015-06-27',
          to: '2018-07-11',
        },
      },
    ],
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/applicant-information',
  },
};

module.exports = { response };