import { nanoid } from "nanoid";

export const formList = {
    school: {
        id: nanoid(),
        schoolName: '',
        isSubmit: true,
        // classes: [
        //     {standard: '', year: '', place: '', country: '', state: '', zipcode: ''}
        // ]
    },
    schoolMenu: ['Pre KG', 'LKG', 'Standard I', 'Standard II','Standard III','Standard IV','Standard VI','Standard VII', 'Standard IX','Standard X','Standard XI','Standard XII']
};