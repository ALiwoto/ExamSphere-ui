
import apiClient from '../../apiClient';
import { CurrentAppTranslation } from '../../translations/appTranslation';
import { TextField } from '@mui/material';
import SelectMenu from '../../components/menus/selectMenu';


const RenderAllFields = (data: any, handleInputChange: any) => {
    // we will be using Object.keys to get all the keys in the data object
    return Object.keys(data).map((field) => {
        // check if type of field is enum
        if (apiClient.isFieldEnum(field)) {
            return (
                <SelectMenu key={`${field}-select-el-key`}
                    labelText={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                    labelId={`${field}-select-label`}
                    name={field}
                    value={data[field as keyof (typeof data)] ?? ''}
                    onChange={handleInputChange}
                    options={Object.values(typeof field).filter(
                        enumValue => enumValue !== undefined && enumValue !== '')}
                />
            );
        }

        const typeName = typeof data[field as keyof (typeof data)];
        // check if type of key is string
        if (typeName === 'string' || typeName === 'number') {
            return (
                <TextField  key={`${field}-text-field-key`}
                    style={{
                        width: '100%',
                        marginBottom: '1rem',
                    }}
                    name={field}
                    variant='standard'
                    type={'text'}
                    label={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                    value={data[field as keyof (typeof data)] ?? ''}
                    onChange={(e) => { handleInputChange(e as any) }}
                    required />
            );
        }
        return null;
    });
};

export default RenderAllFields;
