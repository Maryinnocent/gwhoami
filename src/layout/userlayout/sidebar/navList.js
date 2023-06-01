import React from 'react';

const NavList = {
    user: [
        {
            menu: 'Home',
            icon: <i className="bx bx-grid-alt"></i>,
            sub: [{ name: 'Home', path: '/user' }],
        },
        {
            menu: 'Profile',
            icon: <i className="bx bxs-graduation"></i>,
            sub: [
                { name: 'Profile' },
                {
                    icon: <i className="bx bx-info-square"></i>,
                    name: 'General',
                    path: '/user/profile/general',
                },
                {
                    icon: <i className="bx bx-clipboard"></i>,
                    name: 'Job',
                    path: '/user/profile/job',
                },
                {
                    icon: <i className="bx bxs-component"></i>,
                    name: 'Business',
                    path: '/user/profile/business',
                },
            ],
        },

        {
            menu: 'Education',
            icon: <i className="bx bxs-book-reader"></i>, // bx bxs-institution
            sub: [
                { name: 'Education' },
                {
                    icon: <i className="bx bxs-school"></i>,
                    name: 'School',
                    path: '/user/education/school',
                },
                {
                    icon: <i className="bx bxs-institution"></i>,
                    name: 'College',
                    path: '/user/education/college',
                },
                {
                    icon: <i className="bx bx-grid-horizontal"></i>,
                    name: 'Others',
                    path: '/user/education/other',
                },
            ],
        },
        {
            menu: 'Marriage',
            icon: <i className="bx bx-wallet"></i>,
            sub: [
                { name: 'General' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'General',
                    path: '/user/marriage/general',
                },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Specification',
                    path: '/user/marriage/specification',
                },
                {
                    icon: <i className="bx bxs-injection"></i>,
                    name: 'Family-details',
                    path: '/user/marriage/Family-details',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Health-Status',
                    path: '/user/marriage/Health-Status',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'Future-Plans',
                    path: '/user/marriage/Future-Plans',
                },

            ],
        },
        {
            menu: 'Saving',
            icon: <i className="bx bx-wallet"></i>,
            sub: [
                { name: 'Savings-Online' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Savings-Online',
                    path: '/user/saving/onlinesave',
                },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Student-Savings',
                    path: '/user/saving/studentsave',
                },
                {
                    icon: <i className="bx bxs-injection"></i>,
                    name: 'Certificate-Deposit',
                    path: '/user/saving/certifysave',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Money-Market',
                    path: '/user/saving/moneymarket',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'Online-Trading',
                    path: '/user/saving/tradingonline',
                },
                {
                    icon: <i className="bx bxs-hotel"></i>,
                    name: 'Health-Savings',
                    path: '/user/saving/healthsave',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'IRA-Roth-IRA',
                    path: '/user/saving/irasaving',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Investment',
                    path: '/user/saving/investmentsave',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Life-Insurance',
                    path: '/user/saving/insurancesave',
                },
            ],
        },
        {
            menu: 'Donation',
            icon: <i className="bx bx-wallet"></i>,
            sub: [
                { name: 'General' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'General',
                    path: '/user/donation/general',
                },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Cash-Donation',
                    path: '/user/donation/cashdonation',
                },
                {
                    icon: <i className="bx bxs-injection"></i>,
                    name: 'Valuable-Assets',
                    path: '/user/donation/valuableasset',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Kids-Education',
                    path: '/user/donation/kidseducation',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'In-Kind-Donation',
                    path: '/user/donation/kinddonation',
                },
                {
                    icon: <i className="bx bxs-hotel"></i>,
                    name: 'Global-Warming',
                    path: '/user/donation/globalwarming',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Construction',
                    path: '/user/donation/construction',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Donate-Stocks',
                    path: '/user/donation/stocks',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Planned-Gifts',
                    path: '/user/donation/gifts',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Human-Organs',
                    path: '/user/donation/organs',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Other',
                    path: '/user/donation/other',
                },
            ],
        },
        {
            menu: 'Tax',
            icon: <i className="bx bx-money-withdraw"></i>,
            sub: [
                { name: 'General' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'General',
                    path: '/user/tax/general',
                },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Income',
                    path: '/user/tax/income',
                },
                {
                    icon: <i className="bx bxs-injection"></i>,
                    name: 'Family',
                    path: '/user/tax/family',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Other-Income',
                    path: '/user/tax/Other-Income',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'Education',
                    path: '/user/tax/education',
                },
                {
                    icon: <i className="bx bxs-hotel"></i>,
                    name: 'Retirement',
                    path: '/user/tax/retirement',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Other-Deduction',
                    path: '/user/tax/Other-Deduction',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Own-Home',
                    path: '/user/tax/Own-Home',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Self-Employed',
                    path: '/user/tax/Self-Employed',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'TaxPayments',
                    path: '/user/tax/TaxPayments',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Donation',
                    path: '/user/tax/donation',
                },
            ],
        },
        {
            menu: 'Medical',
            icon: <i className="bx bx-plus-medical"></i>,
            sub: [
                { name: 'Medical' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Newborn',
                    path: '/user/medical/newborn',
                },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Regular',
                    path: '/user/medical/regular',
                },
                {
                    icon: <i className=" bx bxs-injection"></i>,
                    name: 'Immunization',
                    path: '/user/medical/immune',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Allergies',
                    path: '/user/medical/allergi',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'Health-Info',
                    path: '/user/medical/healthinfo',
                },
                {
                    icon: <i className="bx bxs-hotel"></i>,
                    name: 'Surgery',
                    path: '/user/medical/surgery',
                },
                {
                    icon: <i className="bx bx-capsule"></i>,
                    name: 'Medication',
                    path: '/user/medical/medication',
                },
            ],
        },
        {
            menu: 'Crime',
            icon: <i className="bx bx-run"></i>,
            sub: [
                { name: 'Crime' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Driving',
                    path: '/user/crime/driving',
                },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Police_Case',
                    path: '/user/crime/policecase',
                },
                {
                    icon: <i className=" bx bxs-injection"></i>,
                    name: 'Church',
                    path: '/user/crime/church',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Schoolcollege',
                    path: '/user/crime/schoolcollege',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'Sports',
                    path: '/user/crime/sports',
                },
                {
                    icon: <i className="bx bxs-hotel"></i>,
                    name: 'Finance',
                    path: '/user/crime/finance',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Sexual',
                    path: '/user/crime/sexual',
                },
            ],
        },
        {
            menu: 'Insurance',
            icon: <i className="bx bxs-check-shield"></i>,
            sub: [
                { name: 'Insurance' },
                {
                    icon: <i className="bx bx-body"></i>,
                    name: 'Health',
                    path: '/user/insurance/healthinsurance',
                },
                {
                    icon: <i className="bx bx-calendar"></i>,
                    name: 'Monthlypay',
                    path: '/user/insurance/monthlypay',
                },
                {
                    icon: <i className="bx bx-building-house"></i>,
                    name: 'Propertypay',
                    path: '/user/insurance/propertypay',
                },
                {
                    icon: <i className="bx bx-car"></i>,
                    name: 'Vehiclespay',
                    path: '/user/insurance/vehiclespay',
                },
                {
                    icon: <i className="bx bx-run"></i>,
                    name: 'Result',
                    path: '/user/insurance/result',
                },
            ],
        },
        {
            menu: 'Properties',
            icon: <i className="bx bx-landscape"></i>,
            sub: [
                { name: 'Properties' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'General',
                    path: '/user/properties/general',
                },
                {
                    icon: <i className="bx bx-home"></i>,
                    name: 'Property-House',
                    path: '/user/properties/house',
                },
                {
                    icon: <i className="bx bxs-door-open"></i>,
                    name: 'HouseHold-Items',
                    path: '/user/properties/houseitems',
                },
                {
                    icon: <i className="bx bx-car"></i>,
                    name: 'Property-Vehicle',
                    path: '/user/properties/vehicles',
                },
            ],
        },
        {
            menu: 'Certificates',
            icon: <i className="bx bx-certification"></i>,
            sub: [
                { name: 'Certificates' },
                {
                    icon: <i className="bx bxs-user"></i>,
                    name: 'Personal',
                    path: '/user/certificates/personal',
                },
                {
                    icon: <i className="bx bx-church"></i>,
                    name: 'Religious',
                    path: '/user/certificates/religious',
                },
                {
                    icon: <i className="bx bx-fingerprint"></i>,
                    name: 'Identity/Proof',
                    path: '/user/certificates/identity',
                },
                {
                    icon: <i className="bx bxs-graduation"></i>,
                    name: 'Education',
                    path: '/user/certificates/education',
                },
                {
                    icon: <i className="bx bx-award"></i>,
                    name: 'Volunteer/Honorable',
                    path: '/user/certificates/honorable',
                },
            ],
        },
        {
            menu: 'Financial',
            icon: <i className="bx bx-landscape"></i>,
            sub: [
                { name: 'Financial' },
                {
                    icon: <i className="bx bxs-user"></i>,
                    name: 'Income',
                    path: '/user/financial/income',
                },
                {
                    icon: <i className="bx bx-church"></i>,
                    name: 'Assets',
                    path: '/user/financial/assets',
                },
                {
                    icon: <i className="bx bx-fingerprint"></i>,
                    name: 'Liability',
                    path: '/user/financial/liability',
                },
                {
                    icon: <i className="bx bxs-graduation"></i>,
                    name: 'Monthly-Expense',
                    path: '/user/financial/monthlyexpense',
                },
            ],
        },
        {
            menu: 'Bankcredit',
            icon: <i className="bx bx-money-withdraw"></i>,
            sub: [
                { name: 'BankCredit' },
                {
                    icon: <i className="bx bxs-bank"></i>,
                    name: 'Bankgeneral',
                    path: '/user/bankcredit/general',
                },
                {
                    icon: <i className="bx bxs-credit-card-front"></i>,
                    name: 'Creditcard',
                    path: '/user/bankcredit/creditcard',
                },
            ],
        },
        {
            menu: 'Billing',
            icon: <i className="bx bxs-coin-stack"></i>,
            sub: [
                { name: 'Billing' },
                {
                    icon: <i className="bx bxs-detail"></i>,
                    name: 'Billing',
                    path: '/user/billing/billing',
                },
                {
                    icon: <i className="bx bxs-purchase-tag"></i>,
                    name: 'Payment_to',
                    path: '/user/billing/paymentto',
                },

            ],
        },
        {
            menu: 'Memberof',
            icon: <i className="bx bx-plus-medical"></i>,
            sub: [
                { name: 'Memberof' },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Public',
                    path: '/user/memberof/public',
                },
                {
                    icon: <i className="bx bx-info-circle"></i>,
                    name: 'Private',
                    path: '/user/memberof/private',
                },
                {
                    icon: <i className=" bx bxs-injection"></i>,
                    name: 'Volunteer',
                    path: '/user/memberof/volunteer',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Sports',
                    path: '/user/memberof/sports',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'Media',
                    path: '/user/memberof/media',
                },
                {
                    icon: <i className="bx bxs-hotel"></i>,
                    name: 'Social',
                    path: '/user/memberof/social',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Security',
                    path: '/user/memberof/security',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Gaming',
                    path: '/user/memberof/gaming',
                },
                {
                    icon: <i className="bx bxs-first-aid"></i>,
                    name: 'Research',
                    path: '/user/memberof/research',
                },
                {
                    icon: <i className="bx bxs-hotel"></i>,
                    name: 'Finance',
                    path: '/user/memberof/finance',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Coumunity',
                    path: '/user/memberof/coumunity',
                },
                {
                    icon: <i className="bx bxs-virus"></i>,
                    name: 'Construction',
                    path: '/user/memberof/construction',
                },
            ],
        },
        {
            menu: 'Tree',
            icon: <i className="bx bx-money-withdraw"></i>,
            sub: [
                { name: 'Tree' },
                {
                    icon: <i className="bx bxs-bank"></i>,
                    name: 'Grand_Parents',
                    path: '/user/tree/gparents',
                },
                {
                    icon: <i className="bx bxs-credit-card-front"></i>,
                    name: 'Parents',
                    path: '/user/tree/parents',
                },
                {
                    icon: <i className="bx bxs-credit-card-front"></i>,
                    name: 'Other',
                    path: '/user/tree/other',
                },
                {
                    icon: <i className="bx bxs-credit-card-front"></i>,
                    name: 'Spouse',
                    path: '/user/tree/spouse',
                },
                {
                    icon: <i className="bx bxs-credit-card-front"></i>,
                    name: 'Child',
                    path: '/user/tree/child',
                },
            ],
        },

        {
            menu: 'Sports',
            icon: <i className="bx bx-certification"></i>,
            sub: [
                { name: 'Sports' },
                {
                    icon: <i className="bx bxs-user"></i>,
                    name: 'League',
                    path: '/user/sports/league',
                },
                {
                    icon: <i className="bx bx-church"></i>,
                    name: 'Domestic',
                    path: '/user/sports/domestic',
                },
                {
                    icon: <i className="bx bx-fingerprint"></i>,
                    name: 'International',
                    path: '/user/sports/international',
                },
                {
                    icon: <i className="bx bxs-graduation"></i>,
                    name: 'Awards & Points',
                    path: '/user/sports/awards',
                },
                {
                    icon: <i className="bx bx-award"></i>,
                    name: 'Rank',
                    path: '/user/sports/rank',
                },
            ],
        },
        {
            menu: 'Settings',
            icon: <i className="bx bx-cog"></i>,
            sub: [{ name: 'Settings' }],
        },
    ],
};
export default NavList;
