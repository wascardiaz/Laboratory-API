const db = require("../../models");
const LabAnalysis = db.lab_analysis;
const LabAnalyVar = db.lab_analysis_variable;
const LabAnalyVarValue = db.lab_analysis_variable_value;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabAnalysis
exports.create = async (req, res) => {

    const params = req.body;
    params.webResult = params.webResult ? '1' : '0';
    params.status = params.status ? '1' : '0';

    const labAnalysis = new LabAnalysis(params);

    // Save LabAnalysis in the database
    await labAnalysis.save().then(async (labAnaly) => {
        if (params.variables)
            params.variables.forEach(async (vBle, index) => {
                vBle.analyId = labAnaly.id;
                vBle.secuencia = index + 1;
                await LabAnalyVar.create(vBle).then(v => {
                    if (vBle.lab_analysis_variable_values)
                        vBle.lab_analysis_variable_values.forEach(async vVal => {
                            vVal.vbleId = v.id;
                            vVal.Vble_Secuencia = vBle.secuencia;
                            await LabAnalyVarValue.create(vVal);
                        });
                });
            });
        res.status(200).json(labAnaly);
    }).catch(err => {
        // console.log(err);
        res.status(500).json({ message: err.message || 'Algun error ocurrio mientras se creaba el Analisis.' })
    })
}

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {

    // Analysis
    /* const analysies = [
        { description: '17 Cetoesteroides', day: 0, analysisGroupId: 3, sampleTypeId: 36, testId: 1, analysisSubGroupId: 8, sampleContainerId: 0 },
        { description: '17 Hidroxi-Corticosteroides', day: 0, analysisGroupId: 3, sampleTypeId: 2, testId: 11, analysisSubGroupId: 8, sampleContainerId: 9 },
        { description: '17 Hidroxi-Progesterona', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 20, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: '17-Oh', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 28, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Nucleolidasa 5', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 5, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Acetonuria', day: 0, analysisGroupId: 4, sampleTypeId: 2, testId: 6, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Acido Folico', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 51, analysisSubGroupId: 15, sampleContainerId: 1 },
        { description: 'Acido Urico en Orina de 24 Hr', day: 1, analysisGroupId: 3, sampleTypeId: 2, testId: 58, analysisSubGroupId: 1, sampleContainerId: 9 },
        { description: 'Acido Urico en Suero', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 72, analysisSubGroupId: 1, sampleContainerId: 1 },
        { description: 'Acido Valproico', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 79, analysisSubGroupId: 12, sampleContainerId: 1 },
        { description: 'Acido Vanil Mandelico (VMA', day: 1, analysisGroupId: 3, sampleTypeId: 2, testId: 86, analysisSubGroupId: 8, sampleContainerId: 9 },
        { description: 'ACTH', day: 1, analysisGroupId: 3, sampleTypeId: 1, testId: 100, analysisSubGroupId: 8, sampleContainerId: 6 },
        { description: 'Conteo de Addis', day: 0, analysisGroupId: 4, sampleTypeId: 42, testId: 13, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Aglutininas Frias', day: 1, analysisGroupId: 1, sampleTypeId: 11, testId: 118, analysisSubGroupId: 17, sampleContainerId: 1 },
        { description: 'Albumina en Suero', day: 1, analysisGroupId: 4, sampleTypeId: 11, testId: 131, analysisSubGroupId: 9, sampleContainerId: 0 },
        { description: 'Niveles de Alcohol', day: 1, analysisGroupId: 4, sampleTypeId: 2, testId: 152, analysisSubGroupId: 11, sampleContainerId: 0 },
        { description: 'Aldolasa', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 159, analysisSubGroupId: 16, sampleContainerId: 1 },
        { description: 'Alergenos', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 18, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Alfa Amilasa EPS Pancreatica', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 173, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Alfa Feto Proteinas', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 180, analysisSubGroupId: 20, sampleContainerId: 1 },
        { description: 'Alfa HCG', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 186, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Alfa-1-Antitripsina', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 193, analysisSubGroupId: 9, sampleContainerId: 0 },
        { description: 'Amebas en Heces Fecales', day: 1, analysisGroupId: 2, sampleTypeId: 3, testId: 207, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Amebas en Suero', day: 1, analysisGroupId: 2, sampleTypeId: 3, testId: 199, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Amilasa en Orina', day: 1, analysisGroupId: 3, sampleTypeId: 2, testId: 220, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Amilasa en Orina 24 Horas', day: 1, analysisGroupId: 3, sampleTypeId: 2, testId: 213, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Amilasa en Suero', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 227, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Amonio', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 231, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Androstenediona', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 240, analysisSubGroupId: 8, sampleContainerId: 0 },
        { description: 'Anfetamina', day: 0, analysisGroupId: 6, sampleTypeId: 2, testId: 244, analysisSubGroupId: 9, sampleContainerId: 9 },
        { description: 'Anti Cardiolipinas IgG', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 472, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Anti Cardiolipinas IgM', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 469, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Anti DNA', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 256, analysisSubGroupId: 18, sampleContainerId: 0 },
        { description: 'Anti Doping', day: 1, analysisGroupId: 6, sampleTypeId: 2, testId: 316, analysisSubGroupId: 11, sampleContainerId: 9 },
        { description: 'Hepatitis A IgG', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 364, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hepatitis A IgM', day: 0, analysisGroupId: 6, sampleTypeId: 1, testId: 36, analysisSubGroupId: 0, sampleContainerId: 1 },
        { description: 'Hepatitis B IGG', day: 0, analysisGroupId: 5, sampleTypeId: 1, testId: 37, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hepatitis B IgM', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 38, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hepatitis E', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 39, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Anti HBS', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 281, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'HIV', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 935, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hepatitis C', day: 1, analysisGroupId: 5, sampleTypeId: 11, testId: 289, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Anti Rubeola', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 0, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Anti Tpo', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 300, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Anticuerpo Antinucleares (ANA', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 296, analysisSubGroupId: 18, sampleContainerId: 0 },
        { description: 'Antiestroptolisina (ASO', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 72, analysisSubGroupId: 9, sampleContainerId: 1 },
        { description: 'Antigeno Australiano HBsAg', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 351, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Antigeno Carcino-Embriogenico (CEA', day: 0, analysisGroupId: 5, sampleTypeId: 1, testId: 333, analysisSubGroupId: 0, sampleContainerId: 1 },
        { description: 'Antigeno P 24 VIH', day: 0, analysisGroupId: 5, sampleTypeId: 1, testId: 343, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Antigeno Prostatico Especifico', day: 0, analysisGroupId: 5, sampleTypeId: 1, testId: 347, analysisSubGroupId: 0, sampleContainerId: 1 },
        { description: 'Antigenos Febriles', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 355, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Antitiroglobulina', day: 0, analysisGroupId: 5, sampleTypeId: 1, testId: 379, analysisSubGroupId: 0, sampleContainerId: 1 },
        { description: 'Apolipoproteina A1', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1125, analysisSubGroupId: 9, sampleContainerId: 0 },
        { description: 'Apolipoproteina B', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 55, analysisSubGroupId: 9, sampleContainerId: 0 },
        { description: 'Baar en LCR', day: 0, analysisGroupId: 9, sampleTypeId: 11, testId: 56, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'Baar en Orina', day: 0, analysisGroupId: 9, sampleTypeId: 11, testId: 387, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'Baar en Orina 24 Horas', day: 0, analysisGroupId: 3, sampleTypeId: 16, testId: 58, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'Baciloscopia en Esputo', day: 0, analysisGroupId: 9, sampleTypeId: 4, testId: 389, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'Baciloscopia en Fluido', day: 0, analysisGroupId: 9, sampleTypeId: 4, testId: 391, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'Baciloscopia en Orina', day: 0, analysisGroupId: 9, sampleTypeId: 2, testId: 394, analysisSubGroupId: 21, sampleContainerId: 9 },
        { description: 'Baciloscopia Liquido Ascitico', day: 0, analysisGroupId: 9, sampleTypeId: 4, testId: 62, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'Baciloscopia Liquido Pleural', day: 0, analysisGroupId: 9, sampleTypeId: 4, testId: 63, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'Benzodiazepinas', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 403, analysisSubGroupId: 5, sampleContainerId: 0 },
        { description: 'Beta HCG Cualitativa', day: 0, analysisGroupId: 6, sampleTypeId: 1, testId: 405, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Beta HCG Cuantitativa', day: 0, analysisGroupId: 6, sampleTypeId: 1, testId: 408, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Bicarbonato (CO2', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 414, analysisSubGroupId: 3, sampleContainerId: 0 },
        { description: 'Bilirrubina', day: 0, analysisGroupId: 3, sampleTypeId: 2, testId: 417, analysisSubGroupId: 1, sampleContainerId: 0 },
        { description: 'Bun en Sangre', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 0, analysisSubGroupId: 1, sampleContainerId: 0 },
        { description: 'C3 C4', day: 0, analysisGroupId: 6, sampleTypeId: 16, testId: 432, analysisSubGroupId: 9, sampleContainerId: 0 },
        { description: 'CA 125', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 434, analysisSubGroupId: 20, sampleContainerId: 0 },
        { description: 'CA 15-3', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 436, analysisSubGroupId: 20, sampleContainerId: 0 },
        { description: 'CA 19-9', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 439, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Calcio en Orina de 24 Horas', day: 0, analysisGroupId: 3, sampleTypeId: 2, testId: 445, analysisSubGroupId: 3, sampleContainerId: 9 },
        { description: 'Calcio en Suero', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 448, analysisSubGroupId: 3, sampleContainerId: 0 },
        { description: 'Calcio Por Colorimetria', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 451, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Calculo Urinario', day: 0, analysisGroupId: 4, sampleTypeId: 2, testId: 455, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Calprotectina Fecal', day: 0, analysisGroupId: 2, sampleTypeId: 3, testId: 458, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Carbamazepina', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 460, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Celulas Falciformes', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 481, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Celulas LE', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 486, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Chikungunya IgG', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1108, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Chikungunya IgM', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 494, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Citomegalovirus IgG', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 498, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Citomegalovirus IgM', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 499, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cetonuria', day: 0, analysisGroupId: 4, sampleTypeId: 2, testId: 44, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'CK Total', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 504, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'CK-MB', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 506, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Clamidia en Secrecion', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 510, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Clamidia en Suero IgG', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 511, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Clamidia en Suero IgM', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 513, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cloro en Liquidos', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 520, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cloro en Orina de 24 Horas', day: 0, analysisGroupId: 3, sampleTypeId: 36, testId: 523, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cloro en Suero', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 527, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cocaina', day: 0, analysisGroupId: 6, sampleTypeId: 2, testId: 537, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Colera', day: 0, analysisGroupId: 2, sampleTypeId: 3, testId: 539, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Colesterol HDL', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 0, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Colesterol LDL', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 549, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Colesterol Total', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 548, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Complemento C-3', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 541, analysisSubGroupId: 9, sampleContainerId: 1 },
        { description: 'Complemento C-4', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 104, analysisSubGroupId: 9, sampleContainerId: 0 },
        { description: 'Coprologico', day: 0, analysisGroupId: 7, sampleTypeId: 3, testId: 588, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cortisol en Suero A.M', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 106, analysisSubGroupId: 8, sampleContainerId: 0 },
        { description: 'Cortisol en Suero P.M', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 107, analysisSubGroupId: 8, sampleContainerId: 0 },
        { description: 'Creatinina en Orina', day: 0, analysisGroupId: 4, sampleTypeId: 2, testId: 610, analysisSubGroupId: 1, sampleContainerId: 0 },
        { description: 'Creatinina en Suero', day: 1, analysisGroupId: 3, sampleTypeId: 1, testId: 609, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cultivo Ambos Oidos', day: 0, analysisGroupId: 9, sampleTypeId: 31, testId: 625, analysisSubGroupId: 6, sampleContainerId: 0 },
        { description: 'Cultivo de Absceso', day: 0, analysisGroupId: 9, sampleTypeId: 12, testId: 623, analysisSubGroupId: 6, sampleContainerId: 0 },
        { description: 'Cultivo de Aspirado Bronquial', day: 0, analysisGroupId: 9, sampleTypeId: 30, testId: 112, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cultivo de Cavidad Peritoneal', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 116, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Esperma / Semen', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 0, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Esputo', day: 0, analysisGroupId: 9, sampleTypeId: 4, testId: 634, analysisSubGroupId: 6, sampleContainerId: 0 },
        { description: 'Cultivo de Fluido', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 120, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Garganta (Faringe', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 637, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Heces Fecales (Coprocultivo', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 638, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Herida (Aerobio', day: 0, analysisGroupId: 9, sampleTypeId: 16, testId: 653, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cultivo de LCR', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 639, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Liquido Abdominal', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 127, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Liquido Ascitico', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 678, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Liquido Pleural', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 804, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Oido', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 0, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Ojo', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1135, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Orina (Urocultivo', day: 0, analysisGroupId: 4, sampleTypeId: 2, testId: 648, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Cultivo de Pene', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 134, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Punta de Cateter', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 135, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Sangre (Hemocultivo', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 650, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Secrecion de Ulcera', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 660, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Secrecion en General', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 666, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Secrecion Mama', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 658, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Secrecion Nasal', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 689, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Secrecion Pulmonal', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 142, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Sonda Vesical', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 143, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Tubo endotraqueal', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 691, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Uretra', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 671, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Cultivo de Vagina', day: 0, analysisGroupId: 2, sampleTypeId: 16, testId: 0, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Dengue IgG', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 704, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Dengue IgM', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 707, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Depuracion de Creatinina en 24', day: 0, analysisGroupId: 3, sampleTypeId: 2, testId: 151, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'DHEA-S04', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 716, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Digestion en Heces', day: 0, analysisGroupId: 7, sampleTypeId: 3, testId: 718, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Digoxina', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 720, analysisSubGroupId: 12, sampleContainerId: 0 },
        { description: 'Dimero D', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 156, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Dosificacion Fibrinogeno', day: 0, analysisGroupId: 1, sampleTypeId: 14, testId: 739, analysisSubGroupId: 19, sampleContainerId: 2 },
        { description: 'Electroforesis de Proteinas', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 748, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Electroforesis Hemoglobina Acido', day: 0, analysisGroupId: 5, sampleTypeId: 37, testId: 0, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Electroforesis HB Alcalino', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 162, analysisSubGroupId: 5, sampleContainerId: 0 },
        { description: 'Electroforesis Liproteinas', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 761, analysisSubGroupId: 5, sampleContainerId: 0 },
        { description: 'Eosinofilos Conteo Esputo', day: 0, analysisGroupId: 3, sampleTypeId: 16, testId: 568, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Eosinofilos en Sangre', day: 0, analysisGroupId: 1, sampleTypeId: 1, testId: 168, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Epstein Barr Vca IgG', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 169, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Epstein Barr Vca IgM', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 170, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Eritrosedimentacion', day: 0, analysisGroupId: 1, sampleTypeId: 1, testId: 792, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Espermatograma', day: 0, analysisGroupId: 8, sampleTypeId: 5, testId: 793, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Estradiol', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 796, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Estrogenos Totales en Suero', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 801, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Liquido Ascitico', day: 0, analysisGroupId: 1, sampleTypeId: 8, testId: 975, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Extendido de Sangre Periferica', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 181, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Factor IX  Dosificacion', day: 0, analysisGroupId: 10, sampleTypeId: 13, testId: 0, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Factor Reumatoide', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 812, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Factor Reumatoide Cuantitativo', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 813, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Factor Reumatoide Latex', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 185, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Falcemia', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 814, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Fenobarbital', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 818, analysisSubGroupId: 12, sampleContainerId: 0 },
        { description: 'Ferritina', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 819, analysisSubGroupId: 9, sampleContainerId: 0 },
        { description: 'Fibrinogenos Cuantitativo', day: 0, analysisGroupId: 5, sampleTypeId: 14, testId: 823, analysisSubGroupId: 19, sampleContainerId: 2 },
        { description: 'Fosfatasa Acida', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 826, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Fosfatasa Acida Prostatica', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 827, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Fosfatasa Alcalina', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 828, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Fosforo', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 835, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Fosforo en Orina', day: 0, analysisGroupId: 4, sampleTypeId: 2, testId: 833, analysisSubGroupId: 3, sampleContainerId: 0 },
        { description: 'Fosforo en Orina de 24 Horas', day: 0, analysisGroupId: 3, sampleTypeId: 36, testId: 198, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'FSH (Hormona Foliculo Estimulante', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 852, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'FTA-ABS', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 855, analysisSubGroupId: 0, sampleContainerId: 1 },
        { description: 'Gases Arteriales', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 860, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'GGTP (Gamma Glutamil Transferrosa', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 858, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'Glicemia (Glucosa', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 862, analysisSubGroupId: 1, sampleContainerId: 1 },
        { description: 'Glicemia Curva 2 Horas', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 863, analysisSubGroupId: 1, sampleContainerId: 1 },
        { description: 'Glicemia Curva 3 Horas', day: 1, analysisGroupId: 3, sampleTypeId: 11, testId: 0, analysisSubGroupId: 1, sampleContainerId: 1 },
        { description: 'Glicemia PostPrandial', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 866, analysisSubGroupId: 1, sampleContainerId: 1 },
        { description: 'Glucosa 6 Fostato Deshidrogenasa', day: 0, analysisGroupId: 1, sampleTypeId: 1, testId: 872, analysisSubGroupId: 5, sampleContainerId: 0 },
        { description: 'Glucosuria', day: 0, analysisGroupId: 4, sampleTypeId: 2, testId: 882, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Influenza H1N1', day: 0, analysisGroupId: 5, sampleTypeId: 16, testId: 214, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Helicobacter Pilory Anticuerpo', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 216, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Helicobacter Pilory en Heces', day: 0, analysisGroupId: 7, sampleTypeId: 3, testId: 1124, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Gota Gruesa', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 891, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hemocultivo (Aerobico', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 219, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Hemocultivo (Anaerobico', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 914, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Hemoglobina', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 916, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hemoglobina Glicosilada', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 919, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Electroforesis de Hemoglobina', day: 0, analysisGroupId: 5, sampleTypeId: 37, testId: 223, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hemograma', day: 1, analysisGroupId: 1, sampleTypeId: 1, testId: 923, analysisSubGroupId: 2, sampleContainerId: 1 },
        { description: 'Herpes I & II  IgM', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 227, analysisSubGroupId: 4, sampleContainerId: 1 },
        { description: 'Herpes I & II IgG', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 927, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Hierro Serico', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 229, analysisSubGroupId: 15, sampleContainerId: 0 },
        { description: 'Homocisteina', day: 0, analysisGroupId: 1, sampleTypeId: 13, testId: 936, analysisSubGroupId: 19, sampleContainerId: 0 },
        { description: 'Hormona Crecimiento Basal', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 937, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hormona Luteinizante (LH', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 942, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'IGA Inmunoglobulina', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 236, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Ige Inmunoglubulina', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 947, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'IgG Inmunoglobulina', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 949, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'IgM Inmunoglobulina', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 951, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Influenza A & B', day: 0, analysisGroupId: 6, sampleTypeId: 17, testId: 933, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Insulina', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 955, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Ionograma (Cloro, Sodio, Potas', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 244, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'LCR Electroforesis', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 968, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Lactato Deshidrogenasa LDH', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 249, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Leptospira Anticuerpos IgG', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 250, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Leptospira Anticuerpos IgM', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 251, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Hormona Luteinizante - LH', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 252, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Lipasa en Suero', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 253, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Lipasa en Orina', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 254, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Lipidos Totales', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 466, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Liquido Cefalo Raquideo Celula', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 976, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Liquido Cefalo Raquideo VDRL', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 257, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Liquido Peritoneal', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 979, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Liquido Pleural', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 980, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Litemia', day: 0, analysisGroupId: 5, sampleTypeId: 1, testId: 982, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Litio', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 984, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Magnesio', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 984, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Malaria', day: 0, analysisGroupId: 1, sampleTypeId: 1, testId: 985, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Niveles de Marihuana', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 267, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Materia Fecales (Huevos,Parasi', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 988, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Microalbuminuria', day: 0, analysisGroupId: 3, sampleTypeId: 2, testId: 989, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Moco Nasal, Conteo de', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 270, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Mono-Test (Mononucleosis', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 991, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Orina (Uroanalisis', day: 1, analysisGroupId: 4, sampleTypeId: 2, testId: 807, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'P.C.R (Proteinas C. Reativa )', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1021, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Parathormona (PTH Intacta', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 285, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Perfil Renal (Urea, Creatinina', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1010, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Plomo', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1012, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Potasio', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1013, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Ppd (Prueba de La Tuberculina', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1017, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Procalcitonina', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 1018, analysisSubGroupId: 5, sampleContainerId: 0 },
        { description: 'Progesterona', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1019, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Prolactina (PRL', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1020, analysisSubGroupId: 5, sampleContainerId: 0 },
        { description: 'Proteina C Reactiva Cuantitativo', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1023, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Proteina C Reativa Cualitativa', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1022, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Proteinas Diferenciadas (Albumina', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1024, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Proteinas Totales & Parciales', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1032, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'PROTEINAS TOTAELES (ORINA', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 304, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Proteinas Totales en Orina 24', day: 0, analysisGroupId: 3, sampleTypeId: 36, testId: 1028, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Proteinas Totales en Suero', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1030, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Prueba Anti Dopping', day: 0, analysisGroupId: 5, sampleTypeId: 2, testId: 307, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'PSA Libre', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1040, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'PSA Total', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1042, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Pth (Hormona Paratiroidea', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1043, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Reticulocitos (Conteo', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1046, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Reticulocitos', day: 0, analysisGroupId: 1, sampleTypeId: 1, testId: 312, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Rotavirus', day: 0, analysisGroupId: 7, sampleTypeId: 23, testId: 1049, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Rubella (Rubeola) IgG', day: 0, analysisGroupId: 10, sampleTypeId: 11, testId: 552, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Rubella (Rubeola) IgM', day: 0, analysisGroupId: 10, sampleTypeId: 11, testId: 1052, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Sangre Oculta en Heces', day: 0, analysisGroupId: 7, sampleTypeId: 3, testId: 1053, analysisSubGroupId: 6, sampleContainerId: 0 },
        { description: 'Sodio en Suero', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1058, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Sustancias Reductoras', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1060, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'T3', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1062, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'T3 Libre', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 574, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'T4', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1063, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'T4 Libre', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1064, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Tegretol (Carbamazepina', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1066, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Test de Coombs Directo', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1068, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Test de Coombs Indirecto', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1069, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Testosterona en Suero O Plasma', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 1071, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'SGOT (AST', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 337, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'SGPT (ALT', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 338, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Tiempo Coagulacion & Tiempo Sa', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 339, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Tiempo de Coagulacion (Tc', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 1075, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Tiempo de Protombina (Tp', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 1076, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Tiempo de Sangria (Ts', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 1077, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Tiempo de Tromboplastina', day: 0, analysisGroupId: 1, sampleTypeId: 13, testId: 343, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Tipificacion Sanguinea', day: 0, analysisGroupId: 1, sampleTypeId: 1, testId: 896, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Tiroglobulina', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1079, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Toxoplasmosis IgG', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1080, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Toxoplasmosis IgG-IgM', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1081, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Toxoplasmosis IgM', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1082, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Transferina', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 350, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Triglicerido', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 601, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Troponina Cualitativa', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1087, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Troponina Cuantitativa', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 1088, analysisSubGroupId: 16, sampleContainerId: 0 },
        { description: 'TSH', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 941, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'TTP (Tiempo de Tromboplastina', day: 0, analysisGroupId: 1, sampleTypeId: 37, testId: 1078, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Varicela IgG', day: 0, analysisGroupId: 10, sampleTypeId: 11, testId: 1120, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Varicela IgM', day: 0, analysisGroupId: 10, sampleTypeId: 11, testId: 1121, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'VDRL', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1094, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'VDRL en LCR', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 616, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Vitamina B12', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1096, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Vitamina D2 Total', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 363, analysisSubGroupId: 13, sampleContainerId: 0 },
        { description: 'Vitamina D3 (25 OH) (Colecalciferol', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 364, analysisSubGroupId: 13, sampleContainerId: 0 },
        { description: 'Zika Virus IgG', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1100, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Zika Virus IgM', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 1101, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'Coprologico Seriado X3', day: 0, analysisGroupId: 7, sampleTypeId: 3, testId: 370, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'CA 72-4', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1111, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'NT-proBNP', day: 0, analysisGroupId: 5, sampleTypeId: 1, testId: 372, analysisSubGroupId: 0, sampleContainerId: 1 },
        { description: 'ANTI TROMBINA III', day: 0, analysisGroupId: 1, sampleTypeId: 11, testId: 373, analysisSubGroupId: 19, sampleContainerId: 0 },
        { description: 'Proteina S Activada', day: 0, analysisGroupId: 1, sampleTypeId: 11, testId: 374, analysisSubGroupId: 19, sampleContainerId: 0 },
        { description: 'Baciloscopia en Esputo X3', day: 0, analysisGroupId: 9, sampleTypeId: 4, testId: 399, analysisSubGroupId: 21, sampleContainerId: 0 },
        { description: 'ESTUDIO DE LIQUIDO ABDOMINAL', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 377, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'LIQUIDO CEFALO RAQ. GLUCOSA', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 379, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'LIQUIDO CEFALO RAQ. PROTEINAS (132', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 380, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Liquido Cefalorraquideo', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 978, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'CULTIVO DE LIQUIDO CEFALORRAQUIDEO', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 382, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'COPROLOGICO X2', day: 'NULL', analysisGroupId: 'NULL', sampleTypeId: 'NULL', testId: 594, analysisSubGroupId: 'NULL', NULsampleContainerId: 'NULL' },
        { description: 'Herpes I & II  IgM en LCR', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 389, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Herpes I & II IgG en LCR', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 390, analysisSubGroupId: 4, sampleContainerId: 0 },
        { description: 'Antigenos COVID-19 (Hisopadas', day: 0, analysisGroupId: 6, sampleTypeId: 38, testId: 394, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'COVID-19 MEMBRANA IGG-IGM', day: 0, analysisGroupId: 0, sampleTypeId: 11, testId: 1128, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'COVID-19 ANTIGENOS', day: 0, analysisGroupId: 0, sampleTypeId: 17, testId: 1133, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'TSH (RECIEN NACIDO', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1089, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'VIDAS SARS-COV-2 IGM-IGG (CUANTIFICADO', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1127, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'ANTIESTREPTOLISINA (ASO', day: 0, analysisGroupId: 6, sampleTypeId: 11, testId: 325, analysisSubGroupId: 0, sampleContainerId: 2 },
        { description: 'GLICEMIA GLUCOTEX SULLIVAN', day: 0, analysisGroupId: 3, sampleTypeId: 1, testId: 139, analysisSubGroupId: 2, sampleContainerId: 0 },
        { description: 'CONTEO DE RETICULOCITOS', day: 0, analysisGroupId: 1, sampleTypeId: 11, testId: 581, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'DIMERO D', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 726, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'PSA (PRUEBA DE PROSTATA//LIBRE Y TOTAL', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1039, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'PSA LIBRE Y TOTAL', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 1041, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'COLESTEROL DE BAJA DENSIDAD (LDL', day: 0, analysisGroupId: 3, sampleTypeId: 11, testId: 545, analysisSubGroupId: 0, sampleContainerId: 0 },
        { description: 'CONTEO DE EOSINOFILOS EN SEC. NASAL', day: 0, analysisGroupId: 1, sampleTypeId: 17, testId: 570, analysisSubGroupId: 0, sampleContainerId: 1 },
        { description: 'FIBRINOGENO', day: 0, analysisGroupId: 1, sampleTypeId: 1, testId: 821, analysisSubGroupId: 19, sampleContainerId: 2 },
        { description: 'HBS-AG (HEPATITIS B', day: 0, analysisGroupId: 5, sampleTypeId: 11, testId: 899, analysisSubGroupId: 5, sampleContainerId: 2 },];

    if ((await db.lab_analysis.count()) === 0) {
        analysies.forEach(async analysis => {
            const test = await db.test.findOne({ where: { description: { [Op.like]: `${analysis.description}%` } } });
            if (test !== null) {
                analysis.testId = test.id;
                analysis.status = '1';
                analysis.analysisGroupId = analysis.analysisGroupId > 0 ? analysis.analysisGroupId : 1
                analysis.analysisSubGroupId = analysis.analysisSubGroupId > 0 ? analysis.analysisSubGroupId : 1
                analysis.sampleContainerId = analysis.sampleContainerId > 0 ? analysis.sampleContainerId : 1
                analysis.sampleTypeId = analysis.sampleTypeId > 0 ? analysis.sampleTypeId : 1
                console.log(analysis)
                await db.lab_analysis.create(analysis).catch(err => console.log(err))
            }
        });
    } */

    const options = req.query;
    const groupId = options.groupId;
    const testId = options.testId;
    const incAll = options.include
    var condition = null;
    // var condition = options.search ? { description: { [Op.like]: `%${options.search}%` } } : null;
    // console.log(options)    

    if (groupId && testId)
        condition = { analysisGroupId: groupId, testId: testId };
    else if (groupId)
        condition = { analysisGroupId: groupId };
    else if (testId)
        condition = { testId: testId };
    else if (options.search)
        condition = { description: { [Op.like]: `%${options.search}%` } };

    let labAnalisies = null;

    if (options.size) {
        labAnalisies = await LabAnalysis.findAndCountAll({
            where: condition,
            include: { all: true, nested: true },
            // order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
            offset: options.page ? parseInt(options.page) * options.size : 1,
            limit: options.size ? parseInt(options.size) : 5
        }).then(data => {
            return { count: data.count, records: data.rows }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar el Analysis.' })
        });
    }
    else {
        labAnalisies = await LabAnalysis.findAll({
            where: condition,
            include: { all: true, nested: true },
            // order: [['id', 'DESC']]
        }).then(data => {
            console.log(data.dataValues)
            return { count: data.length, records: data }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar el Analysis.' })
        });
    }

    res.status(200).json(labAnalisies);

    // const groupId = req.query.groupId;
    // const testId = req.query.testId;
    // const incAll = req.query.include
    // let labAnalysis = null;
    // var condition = null;

    // if (groupId && testId)
    //     condition = { analysisGroupId: groupId, testId: testId };
    // else if (groupId)
    //     condition = { analysisGroupId: groupId };
    // else if (testId)
    //     condition = { testId: testId };

    // if (incAll && incAll === 'all')
    //     labAnalysis = await LabAnalysis.findAll({
    //         where: condition,
    //         include: [{ model: LabAnalyVar, as: 'variables', include: { model: LabAnalyVarValue } },
    //         { model: db.test, as: 'test' },
    //         { model: db.lab_analysis_group, as: 'group' },
    //         { model: db.lab_sample_type, as: 'sampleType' }]
    //     }).catch(e => console.log(e));
    // else
    //     labAnalysis = await LabAnalysis.findAll({
    //         where: condition, include: [
    //             { model: db.lab_analysis_group, as: 'group' },
    //             { model: db.lab_sample_type, as: 'sampleType' },
    //             { model: db.lab_laboratory, as: 'laboratory' },
    //             { model: db.lab_analysis_variable, as: 'variables', include: db.lab_analysis_variable_value }]
    //     }).catch(e => console.log(e));

    // res.status(200).json(labAnalysis);
};

// Find a single LabAnalysis with an id
exports.findOne = async (req, res) => {
    const qParams = req.query
    let labAnalysis = null;
    if (qParams.include && qParams.include === 'all') {
        labAnalysis = await LabAnalysis.findByPk(req.params.id,
            { include: { all: true, nested: true } },
            /* {
                include: [
                    { model: db.lab_analysis_variable, as: 'variables', include: db.lab_analysis_variable_value },
                    { model: db.test, as: 'test' },
                    { model: db.lab_analysis_group, as: 'group' },
                    { model: db.lab_sample_type, as: 'sampleType' }
                ]
            } */);
    }
    else {
        labAnalysis = await LabAnalysis.findByPk(req.params.id,
            // { include: { all: true, nested: true } }
            { include: { model: db.lab_analysis_variable, as: 'variables' } }
        );
    }

    if (!labAnalysis)
        return res.status(404).json({ message: 'LabAnalysis not found' });

    res.status(200).json(labAnalysis);// basicDetails(labAnalysis);
};

// Update a LabAnalysis by the id in the request
exports.update = async (req, res) => {
    const params = req.body;
    params.status = params.status ? '1' : '0';
    const labAnalysis = await getLabAnalysis(req.params.id);

    if (!labAnalysis) {
        res.status(400).json({ message: 'No se encontro la Analitica' });
        return;
    }
    // copy params to labAnalysis and save
    Object.assign(labAnalysis, params);
    labAnalysis.updated = Date.now();
    await labAnalysis.save().then(async (labAnaly) => {
        // Primero Eliminaos variables y sus valores
        const varContent = await delVarAndValues(labAnalysis.id);
        if (params.variables)
            params.variables.forEach(async (vBle, index) => {
                vBle.analyId = labAnaly.id;
                vBle.secuencia = index + 1;
                await LabAnalyVar.create(vBle).then(v => {
                    if (vBle.lab_analysis_variable_values)
                        vBle.lab_analysis_variable_values.forEach(async vVal => {
                            vVal.vbleId = v.id;
                            vVal.Vble_Secuencia = vBle.secuencia;
                            await LabAnalyVarValue.create(vVal);
                        });
                }).catch(e => console.log(e));
            });

        return res.status(200).send({ message: "LabAnalysis was updated successfully." });

    }).catch(err => {
        console.log(err)
        return res.status(500).send({ message: err.message || "Error updating LabAnalysis with id=" + req.params.id });
    });;

};

// Delete a LabAnalysis with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabAnalysis.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabAnalysis was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabAnalysis with id=${id}. Maybe LabAnalysis was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabAnalysis with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabAnalysis.destroy({
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

async function getLabAnalysis(id) {
    return await LabAnalysis.findByPk(id);
}

async function delVarAndValues(id) {

    const vars = await LabAnalyVar.findAll({ where: { analyId: id } });

    if (!vars) return 0;

    vars.map(async v => {
        await LabAnalyVarValue.destroy({ where: { vbleId: v.id } })
    });

    return await LabAnalyVar.destroy({ where: { analyId: id } });
}

// find all published LabAnalysis
exports.findAllActive = (req, res) => {
    LabAnalysis.findAll({ where: { status: true } })
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