const db = require("../models");
const Country = db.country;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Country
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Country
    const country = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save Country in the database
    Country.create(country)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Country."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {

    const drs = [
        { name: 'Afghanistan', iso_code_2: 'AF', iso_code_3: 'AFG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Albania', iso_code_2: 'AL', iso_code_3: 'ALB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Algeria', iso_code_2: 'DZ', iso_code_3: 'DZA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'American Samoa', iso_code_2: 'AS', iso_code_3: 'ASM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Andorra', iso_code_2: 'AD', iso_code_3: 'AND', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Angola', iso_code_2: 'AO', iso_code_3: 'AGO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Anguilla', iso_code_2: 'AI', iso_code_3: 'AIA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Antarctica', iso_code_2: 'AQ', iso_code_3: 'ATA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Antigua and Barbuda', iso_code_2: 'AG', iso_code_3: 'ATG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Argentina', iso_code_2: 'AR', iso_code_3: 'ARG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Armenia', iso_code_2: 'AM', iso_code_3: 'ARM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Aruba', iso_code_2: 'AW', iso_code_3: 'ABW', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Australia', iso_code_2: 'AU', iso_code_3: 'AUS', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Austria', iso_code_2: 'AT', iso_code_3: 'AUT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Azerbaijan', iso_code_2: 'AZ', iso_code_3: 'AZE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bahamas', iso_code_2: 'BS', iso_code_3: 'BHS', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bahrain', iso_code_2: 'BH', iso_code_3: 'BHR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bangladesh', iso_code_2: 'BD', iso_code_3: 'BGD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Barbados', iso_code_2: 'BB', iso_code_3: 'BRB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Belarus', iso_code_2: 'BY', iso_code_3: 'BLR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Belgium', iso_code_2: 'BE', iso_code_3: 'BEL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Belize', iso_code_2: 'BZ', iso_code_3: 'BLZ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Benin', iso_code_2: 'BJ', iso_code_3: 'BEN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bermuda', iso_code_2: 'BM', iso_code_3: 'BMU', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bhutan', iso_code_2: 'BT', iso_code_3: 'BTN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bolivia', iso_code_2: 'BO', iso_code_3: 'BOL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bosnia and Herzegovina', iso_code_2: 'BA', iso_code_3: 'BIH', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Botswana', iso_code_2: 'BW', iso_code_3: 'BWA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bouvet Island', iso_code_2: 'BV', iso_code_3: 'BVT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Brazil', iso_code_2: 'BR', iso_code_3: 'BRA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'British Indian Ocean Territory', iso_code_2: 'IO', iso_code_3: 'IOT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Brunei Darussalam', iso_code_2: 'BN', iso_code_3: 'BRN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bulgaria', iso_code_2: 'BG', iso_code_3: 'BGR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Burkina Faso', iso_code_2: 'BF', iso_code_3: 'BFA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Burundi', iso_code_2: 'BI', iso_code_3: 'BDI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cambodia', iso_code_2: 'KH', iso_code_3: 'KHM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cameroon', iso_code_2: 'CM', iso_code_3: 'CMR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Canada', iso_code_2: 'CA', iso_code_3: 'CAN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cape Verde', iso_code_2: 'CV', iso_code_3: 'CPV', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cayman Islands', iso_code_2: 'KY', iso_code_3: 'CYM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Central African Republic', iso_code_2: 'CF', iso_code_3: 'CAF', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Chad', iso_code_2: 'TD', iso_code_3: 'TCD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Chile', iso_code_2: 'CL', iso_code_3: 'CHL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'China', iso_code_2: 'CN', iso_code_3: 'CHN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Christmas Island', iso_code_2: 'CX', iso_code_3: 'CXR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cocos (Keeling) Islands', iso_code_2: 'CC', iso_code_3: 'CCK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Colombia', iso_code_2: 'CO', iso_code_3: 'COL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Comoros', iso_code_2: 'KM', iso_code_3: 'COM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Congo', iso_code_2: 'CG', iso_code_3: 'COG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cook Islands', iso_code_2: 'CK', iso_code_3: 'COK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Costa Rica', iso_code_2: 'CR', iso_code_3: 'CRI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cote D\'Ivoire', iso_code_2: 'CI', iso_code_3: 'CIV', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Croatia', iso_code_2: 'HR', iso_code_3: 'HRV', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cuba', iso_code_2: 'CU', iso_code_3: 'CUB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Cyprus', iso_code_2: 'CY', iso_code_3: 'CYP', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Czech Republic', iso_code_2: 'CZ', iso_code_3: 'CZE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Denmark', iso_code_2: 'DK', iso_code_3: 'DNK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Djibouti', iso_code_2: 'DJ', iso_code_3: 'DJI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Dominica', iso_code_2: 'DM', iso_code_3: 'DMA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Dominican Republic', iso_code_2: 'DO', iso_code_3: 'DOM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'East Timor', iso_code_2: 'TL', iso_code_3: 'TLS', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Ecuador', iso_code_2: 'EC', iso_code_3: 'ECU', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Egypt', iso_code_2: 'EG', iso_code_3: 'EGY', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'El Salvador', iso_code_2: 'SV', iso_code_3: 'SLV', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Equatorial Guinea', iso_code_2: 'GQ', iso_code_3: 'GNQ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Eritrea', iso_code_2: 'ER', iso_code_3: 'ERI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Estonia', iso_code_2: 'EE', iso_code_3: 'EST', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Ethiopia', iso_code_2: 'ET', iso_code_3: 'ETH', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Falkland Islands (Malvinas)', iso_code_2: 'FK', iso_code_3: 'FLK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Faroe Islands', iso_code_2: 'FO', iso_code_3: 'FRO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Fiji', iso_code_2: 'FJ', iso_code_3: 'FJI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Finland', iso_code_2: 'FI', iso_code_3: 'FIN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'France, Metropolitan', iso_code_2: 'FR', iso_code_3: 'FRA', address_format_id: 1, postcode_required: 1, userId: 1, statu: '1' },
        { name: 'French Guiana', iso_code_2: 'GF', iso_code_3: 'GUF', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'French Polynesia', iso_code_2: 'PF', iso_code_3: 'PYF', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'French Southern Territories', iso_code_2: 'TF', iso_code_3: 'ATF', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Gabon', iso_code_2: 'GA', iso_code_3: 'GAB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Gambia', iso_code_2: 'GM', iso_code_3: 'GMB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Georgia', iso_code_2: 'GE', iso_code_3: 'GEO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Germany', iso_code_2: 'DE', iso_code_3: 'DEU', address_format_id: 1, postcode_required: 1, userId: 1, statu: '1' },
        { name: 'Ghana', iso_code_2: 'GH', iso_code_3: 'GHA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Gibraltar', iso_code_2: 'GI', iso_code_3: 'GIB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Greece', iso_code_2: 'GR', iso_code_3: 'GRC', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Greenland', iso_code_2: 'GL', iso_code_3: 'GRL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Grenada', iso_code_2: 'GD', iso_code_3: 'GRD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Guadeloupe', iso_code_2: 'GP', iso_code_3: 'GLP', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Guam', iso_code_2: 'GU', iso_code_3: 'GUM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Guatemala', iso_code_2: 'GT', iso_code_3: 'GTM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Guinea', iso_code_2: 'GN', iso_code_3: 'GIN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Guinea-Bissau', iso_code_2: 'GW', iso_code_3: 'GNB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Guyana', iso_code_2: 'GY', iso_code_3: 'GUY', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Haiti', iso_code_2: 'HT', iso_code_3: 'HTI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Heard and Mc Donald Islands', iso_code_2: 'HM', iso_code_3: 'HMD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Honduras', iso_code_2: 'HN', iso_code_3: 'HND', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Hong Kong', iso_code_2: 'HK', iso_code_3: 'HKG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Hungary', iso_code_2: 'HU', iso_code_3: 'HUN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Iceland', iso_code_2: 'IS', iso_code_3: 'ISL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'India', iso_code_2: 'IN', iso_code_3: 'IND', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Indonesia', iso_code_2: 'ID', iso_code_3: 'IDN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Iran (Islamic Republic of)', iso_code_2: 'IR', iso_code_3: 'IRN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Iraq', iso_code_2: 'IQ', iso_code_3: 'IRQ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Ireland', iso_code_2: 'IE', iso_code_3: 'IRL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Israel', iso_code_2: 'IL', iso_code_3: 'ISR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Italy', iso_code_2: 'IT', iso_code_3: 'ITA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Jamaica', iso_code_2: 'JM', iso_code_3: 'JAM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Japan', iso_code_2: 'JP', iso_code_3: 'JPN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Jordan', iso_code_2: 'JO', iso_code_3: 'JOR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Kazakhstan', iso_code_2: 'KZ', iso_code_3: 'KAZ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Kenya', iso_code_2: 'KE', iso_code_3: 'KEN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Kiribati', iso_code_2: 'KI', iso_code_3: 'KIR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'North Korea', iso_code_2: 'KP', iso_code_3: 'PRK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'South Korea', iso_code_2: 'KR', iso_code_3: 'KOR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Kuwait', iso_code_2: 'KW', iso_code_3: 'KWT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Kyrgyzstan', iso_code_2: 'KG', iso_code_3: 'KGZ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Lao People\'s Democratic Republic', iso_code_2: 'LA', iso_code_3: 'LAO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Latvia', iso_code_2: 'LV', iso_code_3: 'LVA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Lebanon', iso_code_2: 'LB', iso_code_3: 'LBN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Lesotho', iso_code_2: 'LS', iso_code_3: 'LSO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Liberia', iso_code_2: 'LR', iso_code_3: 'LBR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Libyan Arab Jamahiriya', iso_code_2: 'LY', iso_code_3: 'LBY', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Liechtenstein', iso_code_2: 'LI', iso_code_3: 'LIE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Lithuania', iso_code_2: 'LT', iso_code_3: 'LTU', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Luxembourg', iso_code_2: 'LU', iso_code_3: 'LUX', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Macau', iso_code_2: 'MO', iso_code_3: 'MAC', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'FYROM', iso_code_2: 'MK', iso_code_3: 'MKD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Madagascar', iso_code_2: 'MG', iso_code_3: 'MDG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Malawi', iso_code_2: 'MW', iso_code_3: 'MWI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Malaysia', iso_code_2: 'MY', iso_code_3: 'MYS', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Maldives', iso_code_2: 'MV', iso_code_3: 'MDV', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Mali', iso_code_2: 'ML', iso_code_3: 'MLI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Malta', iso_code_2: 'MT', iso_code_3: 'MLT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Marshall Islands', iso_code_2: 'MH', iso_code_3: 'MHL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Martinique', iso_code_2: 'MQ', iso_code_3: 'MTQ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Mauritania', iso_code_2: 'MR', iso_code_3: 'MRT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Mauritius', iso_code_2: 'MU', iso_code_3: 'MUS', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Mayotte', iso_code_2: 'YT', iso_code_3: 'MYT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Mexico', iso_code_2: 'MX', iso_code_3: 'MEX', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Micronesia, Federated States of', iso_code_2: 'FM', iso_code_3: 'FSM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Moldova, Republic of', iso_code_2: 'MD', iso_code_3: 'MDA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Monaco', iso_code_2: 'MC', iso_code_3: 'MCO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Mongolia', iso_code_2: 'MN', iso_code_3: 'MNG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Montserrat', iso_code_2: 'MS', iso_code_3: 'MSR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Morocco', iso_code_2: 'MA', iso_code_3: 'MAR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Mozambique', iso_code_2: 'MZ', iso_code_3: 'MOZ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Myanmar', iso_code_2: 'MM', iso_code_3: 'MMR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Namibia', iso_code_2: 'NA', iso_code_3: 'NAM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Nauru', iso_code_2: 'NR', iso_code_3: 'NRU', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Nepal', iso_code_2: 'NP', iso_code_3: 'NPL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Netherlands', iso_code_2: 'NL', iso_code_3: 'NLD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Netherlands Antilles', iso_code_2: 'AN', iso_code_3: 'ANT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'New Caledonia', iso_code_2: 'NC', iso_code_3: 'NCL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'New Zealand', iso_code_2: 'NZ', iso_code_3: 'NZL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Nicaragua', iso_code_2: 'NI', iso_code_3: 'NIC', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Niger', iso_code_2: 'NE', iso_code_3: 'NER', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Nigeria', iso_code_2: 'NG', iso_code_3: 'NGA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Niue', iso_code_2: 'NU', iso_code_3: 'NIU', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Norfolk Island', iso_code_2: 'NF', iso_code_3: 'NFK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Northern Mariana Islands', iso_code_2: 'MP', iso_code_3: 'MNP', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Norway', iso_code_2: 'NO', iso_code_3: 'NOR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Oman', iso_code_2: 'OM', iso_code_3: 'OMN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Pakistan', iso_code_2: 'PK', iso_code_3: 'PAK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Palau', iso_code_2: 'PW', iso_code_3: 'PLW', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Panama', iso_code_2: 'PA', iso_code_3: 'PAN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Papua New Guinea', iso_code_2: 'PG', iso_code_3: 'PNG', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Paraguay', iso_code_2: 'PY', iso_code_3: 'PRY', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Peru', iso_code_2: 'PE', iso_code_3: 'PER', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Philippines', iso_code_2: 'PH', iso_code_3: 'PHL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Pitcairn', iso_code_2: 'PN', iso_code_3: 'PCN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Poland', iso_code_2: 'PL', iso_code_3: 'POL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Portugal', iso_code_2: 'PT', iso_code_3: 'PRT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Puerto Rico', iso_code_2: 'PR', iso_code_3: 'PRI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Qatar', iso_code_2: 'QA', iso_code_3: 'QAT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Reunion', iso_code_2: 'RE', iso_code_3: 'REU', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'România', iso_code_2: 'RO', iso_code_3: 'ROM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Russian Federation', iso_code_2: 'RU', iso_code_3: 'RUS', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Rwanda', iso_code_2: 'RW', iso_code_3: 'RWA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Saint Kitts and Nevis', iso_code_2: 'KN', iso_code_3: 'KNA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Saint Lucia', iso_code_2: 'LC', iso_code_3: 'LCA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Saint Vincent and the Grenadines', iso_code_2: 'VC', iso_code_3: 'VCT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Samoa', iso_code_2: 'WS', iso_code_3: 'WSM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'San Marino', iso_code_2: 'SM', iso_code_3: 'SMR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Sao Tome and Principe', iso_code_2: 'ST', iso_code_3: 'STP', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Saudi Arabia', iso_code_2: 'SA', iso_code_3: 'SAU', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Senegal', iso_code_2: 'SN', iso_code_3: 'SEN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Seychelles', iso_code_2: 'SC', iso_code_3: 'SYC', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Sierra Leone', iso_code_2: 'SL', iso_code_3: 'SLE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Singapore', iso_code_2: 'SG', iso_code_3: 'SGP', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Slovak Republic', iso_code_2: 'SK', iso_code_3: 'SVK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Slovenia', iso_code_2: 'SI', iso_code_3: 'SVN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Solomon Islands', iso_code_2: 'SB', iso_code_3: 'SLB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Somalia', iso_code_2: 'SO', iso_code_3: 'SOM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'South Africa', iso_code_2: 'ZA', iso_code_3: 'ZAF', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'South Georgia &amp; South Sandwich Islands', iso_code_2: 'GS', iso_code_3: 'SGS', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Spain', iso_code_2: 'ES', iso_code_3: 'ESP', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Sri Lanka', iso_code_2: 'LK', iso_code_3: 'LKA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'St. Helena', iso_code_2: 'SH', iso_code_3: 'SHN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'St. Pierre and Miquelon', iso_code_2: 'PM', iso_code_3: 'SPM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Sudan', iso_code_2: 'SD', iso_code_3: 'SDN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Suriname', iso_code_2: 'SR', iso_code_3: 'SUR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Svalbard and Jan Mayen Islands', iso_code_2: 'SJ', iso_code_3: 'SJM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Swaziland', iso_code_2: 'SZ', iso_code_3: 'SWZ', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Sweden', iso_code_2: 'SE', iso_code_3: 'SWE', address_format_id: 1, postcode_required: 1, userId: 1, statu: '1' },
        { name: 'Switzerland', iso_code_2: 'CH', iso_code_3: 'CHE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Syrian Arab Republic', iso_code_2: 'SY', iso_code_3: 'SYR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Taiwan', iso_code_2: 'TW', iso_code_3: 'TWN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Tajikistan', iso_code_2: 'TJ', iso_code_3: 'TJK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Tanzania, United Republic of', iso_code_2: 'TZ', iso_code_3: 'TZA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Thailand', iso_code_2: 'TH', iso_code_3: 'THA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Togo', iso_code_2: 'TG', iso_code_3: 'TGO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Tokelau', iso_code_2: 'TK', iso_code_3: 'TKL', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Tonga', iso_code_2: 'TO', iso_code_3: 'TON', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Trinidad and Tobago', iso_code_2: 'TT', iso_code_3: 'TTO', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Tunisia', iso_code_2: 'TN', iso_code_3: 'TUN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Turkey', iso_code_2: 'TR', iso_code_3: 'TUR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Turkmenistan', iso_code_2: 'TM', iso_code_3: 'TKM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Turks and Caicos Islands', iso_code_2: 'TC', iso_code_3: 'TCA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Tuvalu', iso_code_2: 'TV', iso_code_3: 'TUV', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Uganda', iso_code_2: 'UG', iso_code_3: 'UGA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Ukraine', iso_code_2: 'UA', iso_code_3: 'UKR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'United Arab Emirates', iso_code_2: 'AE', iso_code_3: 'ARE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'United Kingdom', iso_code_2: 'GB', iso_code_3: 'GBR', address_format_id: 1, postcode_required: 1, userId: 1, statu: '1' },
        { name: 'United States', iso_code_2: 'US', iso_code_3: 'USA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'United States Minor Outlying Islands', iso_code_2: 'UM', iso_code_3: 'UMI', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Uruguay', iso_code_2: 'UY', iso_code_3: 'URY', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Uzbekistan', iso_code_2: 'UZ', iso_code_3: 'UZB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Vanuatu', iso_code_2: 'VU', iso_code_3: 'VUT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Vatican City State (Holy See)', iso_code_2: 'VA', iso_code_3: 'VAT', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Venezuela', iso_code_2: 'VE', iso_code_3: 'VEN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Viet Nam', iso_code_2: 'VN', iso_code_3: 'VNM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Virgin Islands (British)', iso_code_2: 'VG', iso_code_3: 'VGB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Virgin Islands (U.S.)', iso_code_2: 'VI', iso_code_3: 'VIR', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Wallis and Futuna Islands', iso_code_2: 'WF', iso_code_3: 'WLF', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Western Sahara', iso_code_2: 'EH', iso_code_3: 'ESH', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Yemen', iso_code_2: 'YE', iso_code_3: 'YEM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Democratic Republic of Congo', iso_code_2: 'CD', iso_code_3: 'COD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Zambia', iso_code_2: 'ZM', iso_code_3: 'ZMB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Zimbabwe', iso_code_2: 'ZW', iso_code_3: 'ZWE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Montenegro', iso_code_2: 'ME', iso_code_3: 'MNE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Serbia', iso_code_2: 'RS', iso_code_3: 'SRB', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Aaland Islands', iso_code_2: 'AX', iso_code_3: 'ALA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Bonaire, Sint Eustatius and Saba', iso_code_2: 'BQ', iso_code_3: 'BES', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Curacao', iso_code_2: 'CW', iso_code_3: 'CUW', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Palestinian Territory, Occupied', iso_code_2: 'PS', iso_code_3: 'PSE', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'South Sudan', iso_code_2: 'SS', iso_code_3: 'SSD', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'St. Barthelemy', iso_code_2: 'BL', iso_code_3: 'BLM', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'St. Martin (French part)', iso_code_2: 'MF', iso_code_3: 'MAF', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Canary Islands', iso_code_2: 'IC', iso_code_3: 'ICA', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Ascension Island (British)', iso_code_2: 'AC', iso_code_3: 'ASC', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Kosovo, Republic of', iso_code_2: 'XK', iso_code_3: 'UNK', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Isle of Man', iso_code_2: 'IM', iso_code_3: 'IMN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Tristan da Cunha', iso_code_2: 'TA', iso_code_3: 'SHN', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Guernsey', iso_code_2: 'GG', iso_code_3: 'GGY', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
        { name: 'Jersey', iso_code_2: 'JE', iso_code_3: 'JEY', address_format_id: 1, postcode_required: 0, userId: 1, statu: '1' },
    ];

    /* drs.forEach((element, index) => {
        // element.personId = index + 1;
        const md = new Country();
        Object.assign(md, element);
        // console.log(md.dataValues);
        Country.create(element);
    }); */

    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const country = await Country.findAll({ where: condition });
    res.status(200).json(country);
};

// Find a single Country with an id
exports.findOne = async (req, res) => {
    const country = await Country.findByPk(req.params.id, { include: db.person });

    if (!country)
        res.status(404).json({ message: 'Country not found' });

    res.status(200).json(country);// basicDetails(country);
};

// Update a Country by the id in the request
exports.update = async (req, res) => {
    const country = await getCountry(req.params.id);
    if (country && country.person) {
        const params = req.body;
        const person = country.person;
        Object.assign(person, params.person);
        await person.save().catch(e => { console.log(e); return res.status(400).json({ message: e.message }) })
        Object.assign(country, params);
        country.updated = Date.now();
        country.status = country.status ? '1' : '0';
        await country.save().catch(e => { console.log(e); return res.status(400).json({ message: e.message }) });
        res.status(200).json({ message: 'Médico actualizado satisfactoriamente.' });
    }
    else
        res.status(400).json({ message: 'Error en el servidor.' })
};

// Delete a Country with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Country.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Country was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Country with id=${id}. Maybe Country was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Country with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Country.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Properties were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all properties."
            });
        });
};

async function getCountry(id) {
    // const country = await Country.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    return await Country.findByPk(id, { include: db.person })
        .then(m => { return m; })
        .catch(e => { console.log(e); return res.status(400).json({ message: e.message }) });
}

function basicDetails(country) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = country;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Country
exports.findAllActive = (req, res) => {
    Country.findAll({ where: { status: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving properties."
            });
        });
};