import React from "react";

const NavList = {
    user: [{
        menu: 'Home',
        icon: <i className="bx bx-grid-alt"></i>,
        sub: [
            { name: 'Home', path: "/user" },
        ]
    }, {
        menu: 'Profile',
        icon: <i className="bx bxs-graduation"></i>,
        sub: [
            { name: 'Profile' },
            { icon: <i className="bx bx-info-square"></i>, name: 'General', path: "/user/profile/general" },
            { icon: <i className="bx bx-clipboard"></i>, name: 'Job', path: "/user/profile/job" },
            { icon: <i className="bx bxs-component"></i>, name: 'Business', path: "/user/profile/business" }
        ]
    }, {
        menu: 'Education',
        icon: <i className="bx bxs-book-reader"></i>,// bx bxs-institution
        sub: [
            { name: 'Education' },
            { icon: <i className="bx bxs-school"></i>, name: 'School', path: "/user/education/school" },
            { icon: <i className="bx bxs-institution"></i>, name: 'College', path: "/user/education/college" },
            { icon: <i className="bx bx-grid-horizontal"></i>, name: 'Others', path: "/user/education/other" }

        ]
    }, {
        menu: 'Medical',
        icon: <i className="bx bx-plus-medical"></i>,
        sub: [
            { name: 'Medical' },
            { icon: <i className="bx bx-info-circle"></i>, name: 'General', path: "/user/medical/general" },
            { icon: <i className=" bx bxs-injection"></i>, name: 'Immunization', path: "/user/medical/immune" },
            { icon: <i className="bx bxs-virus"></i>, name: 'Allergies', path: "/user/medical/allergi" },
            { icon: <i className="bx bxs-first-aid"></i>, name: 'Health-Info', path: "/user/medical/healthinfo" },
            { icon: <i className="bx bxs-hotel"></i>, name: 'Surgery', path: "/user/medical/surgery" },
            { icon: <i className="bx bx-capsule"></i>, name: 'Medication', path: "/user/medical/medication" },
        ]
    }, {
        menu: 'Insurance',
        icon: <i className="bx bxs-check-shield"></i>,
        sub: [
            { name: 'Insurance' },
            { icon: <i className="bx bx-body"></i>, name: 'Health', path: "/user/insurance/healthinsurance" },
            { icon: <i className="bx bx-calendar"></i>, name: 'Monthlypay', path: "/user/insurance/monthlypay" },
            { icon: <i className="bx bx-building-house"></i>, name: 'Propertypay', path: "/user/insurance/propertypay" },
            { icon: <i className="bx bx-car"></i>, name: 'Vehiclespay', path: "/user/insurance/vehiclespay" },
            { icon: <i className="bx bx-run"></i>, name: 'Result', path: "/user/insurance/result" }
        ]
    }, {
        menu: 'Properties',
        icon: <i className="bx bx-landscape"></i>,
        sub: [
            { name: 'Properties' },
            { icon: <i className="bx bx-info-circle"></i>, name: 'General', path: "/user/properties/general" },
            { icon: <i className="bx bx-home"></i>, name: 'Property-House', path: "/user/properties/house" },
            { icon: <i className="bx bxs-door-open"></i>, name: 'HouseHold-Items', path: "/user/properties/houseitems" },
            { icon: <i className="bx bx-car"></i>, name: 'Property-Vehicle', path: "/user/properties/vehicles" }
        ]
    
    }, {
        menu: 'Certificates',
        icon: <i className="bx bx-certification"></i>,
        sub: [
            { name: 'Certificates' },
            { icon: <i className="bx bxs-user"></i>, name: 'Personal', path: "/user/certificates/personal" },
            { icon: <i className="bx bx-church"></i>, name: 'Religious', path: "/user/certificates/religious" },
            { icon: <i className="bx bx-fingerprint"></i>, name: 'Identity/Proof', path: "/user/certificates/identity" },
            { icon: <i className="bx bxs-graduation"></i>, name: 'Education', path: "/user/certificates/education" },
            { icon: <i className="bx bx-award"></i>, name: 'Volunteer/Honorable', path: "/user/certificates/honorable" }
        ]
    }, {
        menu: 'Financial',
        icon: <i className="bx bx-landscape"></i>,
        sub: [
            { name: 'Financial' },
            { icon: <i className="bx bxs-user"></i>, name: 'Income', path: "/user/financial/income" },
            { icon: <i className="bx bx-church"></i>, name: 'Assets', path: "/user/financial/assets" },
            { icon: <i className="bx bx-fingerprint"></i>, name: 'Liability', path: "/user/financial/liability" },
            { icon: <i className="bx bxs-graduation"></i>, name: 'Monthly-Expense', path: "/user/financial/monthlyexpense" }
            
        ]
    }, {
        menu: 'Bankcredit',
        icon: <i className="bx bx-money-withdraw"></i>,
        sub: [
            { name: 'BankCredit' },
            { icon: <i className="bx bxs-bank"></i>, name: 'Bankgeneral', path: "/user/bankcredit/general" },
            { icon: <i className="bx bxs-credit-card-front"></i>, name: 'Creditcard', path: "/user/bankcredit/creditcard" }
        ]
    }, {
        menu: 'Settings',
        icon: <i className="bx bx-cog"></i>,
        sub: [
            { name: 'Settings' },
        ]
    }]
}
export default NavList;