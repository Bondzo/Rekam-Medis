export type PhysicalExamFields = Record<string, string>;

export type PhysicalExamField = {
    key: string;
    label: string;
    placeholder?: string;
    multiline?: boolean;
};

export type PhysicalExamSection = {
    title: string;
    fields: PhysicalExamField[];
};

type SpecialistConfig = {
    title: string;
    fields: PhysicalExamField[];
};

const additionalNotesField: PhysicalExamField = {
    key: 'additional_notes',
    label: 'Catatan Lain',
    placeholder: 'Pemeriksaan tambahan atau teks lama',
    multiline: true,
};

const specialistConfigs: Record<string, SpecialistConfig> = {
    umum: {
        title: 'Pemeriksaan Fisik Dokter Umum',
        fields: [
            { key: 'consciousness', label: 'Kesadaran', placeholder: 'Compos Mentis' },
            { key: 'blood_pressure', label: 'Tekanan Darah', placeholder: '120/80 mmHg' },
            { key: 'pulse', label: 'Nadi', placeholder: '80 x/menit' },
            { key: 'respiration', label: 'Respirasi', placeholder: '20 x/menit' },
            { key: 'temperature', label: 'Suhu', placeholder: '36.8 C' },
            { key: 'head', label: 'Kepala', placeholder: 'Normal' },
            { key: 'eyes', label: 'Mata', placeholder: 'Konjungtiva tidak anemis' },
            { key: 'ent', label: 'THT', placeholder: 'Dalam batas normal' },
            { key: 'heart', label: 'Jantung', placeholder: 'Bunyi jantung normal' },
            { key: 'lungs', label: 'Paru', placeholder: 'Bunyi paru normal' },
            { key: 'abdomen', label: 'Abdomen', placeholder: 'Supel, tidak nyeri tekan' },
            { key: 'extremities', label: 'Ekstremitas', placeholder: 'Tidak ada kelainan' },
        ],
    },
    anak: {
        title: 'Pemeriksaan Fisik Dokter Anak',
        fields: [
            { key: 'weight', label: 'Berat Badan', placeholder: '12 kg' },
            { key: 'height', label: 'Tinggi Badan', placeholder: '85 cm' },
            { key: 'head_circumference', label: 'Lingkar Kepala', placeholder: '48 cm' },
            { key: 'development_status', label: 'Status Tumbuh Kembang', placeholder: 'Sesuai usia' },
            { key: 'nutrition_status', label: 'Status Gizi', placeholder: 'Baik' },
            { key: 'reflexes', label: 'Refleks', placeholder: 'Normal' },
            { key: 'heart', label: 'Jantung', placeholder: 'Bunyi jantung normal' },
            { key: 'lungs', label: 'Paru', placeholder: 'Bunyi paru normal' },
            { key: 'abdomen', label: 'Abdomen', placeholder: 'Supel' },
            { key: 'immunization', label: 'Imunisasi', placeholder: 'Sesuai jadwal' },
        ],
    },
    mata: {
        title: 'Pemeriksaan Fisik Dokter Mata',
        fields: [
            { key: 'visual_acuity', label: 'Visus', placeholder: 'OD 6/6, OS 6/6' },
            { key: 'eyelids', label: 'Kelopak Mata', placeholder: 'Normal' },
            { key: 'conjunctiva', label: 'Konjungtiva', placeholder: 'Tidak hiperemis' },
            { key: 'cornea', label: 'Kornea', placeholder: 'Jernih' },
            { key: 'pupil', label: 'Pupil', placeholder: 'Isokor, refleks cahaya baik' },
            { key: 'eye_movement', label: 'Gerakan Bola Mata', placeholder: 'Bebas ke segala arah' },
            { key: 'intraocular_pressure', label: 'Tekanan Bola Mata', placeholder: 'Dalam batas normal' },
            { key: 'retina_optic_nerve', label: 'Retina / Saraf Optik', placeholder: 'Dalam batas normal' },
        ],
    },
    gigi: {
        title: 'Pemeriksaan Fisik Dokter Gigi',
        fields: [
            { key: 'cavities', label: 'Gigi Berlubang', placeholder: 'Tidak ada' },
            { key: 'gums', label: 'Gusi', placeholder: 'Tidak bengkak' },
            { key: 'calculus', label: 'Karang Gigi', placeholder: 'Minimal' },
            { key: 'tooth_alignment', label: 'Susunan Gigi', placeholder: 'Rapi' },
            { key: 'bite', label: 'Gigitan', placeholder: 'Normal' },
            { key: 'tongue', label: 'Lidah', placeholder: 'Normal' },
            { key: 'oral_cavity', label: 'Rongga Mulut', placeholder: 'Bersih' },
            { key: 'jaw_joint', label: 'Sendi Rahang', placeholder: 'Tidak nyeri' },
        ],
    },
    tht: {
        title: 'Pemeriksaan Fisik Dokter THT',
        fields: [
            { key: 'outer_ear', label: 'Telinga Luar', placeholder: 'Normal' },
            { key: 'eardrum', label: 'Gendang Telinga', placeholder: 'Intak' },
            { key: 'nose', label: 'Hidung', placeholder: 'Normal' },
            { key: 'nasal_cavity', label: 'Rongga Hidung', placeholder: 'Tidak ada sekret' },
            { key: 'throat', label: 'Tenggorokan', placeholder: 'Tidak hiperemis' },
            { key: 'tonsils', label: 'Amandel', placeholder: 'T1-T1' },
            { key: 'hearing', label: 'Pendengaran', placeholder: 'Dalam batas normal' },
        ],
    },
    kulit: {
        title: 'Pemeriksaan Fisik Dokter Kulit',
        fields: [
            { key: 'skin', label: 'Kulit', placeholder: 'Dalam batas normal' },
            { key: 'hair', label: 'Rambut', placeholder: 'Normal' },
            { key: 'scalp', label: 'Kulit Kepala', placeholder: 'Normal' },
            { key: 'nails', label: 'Kuku', placeholder: 'Normal' },
            { key: 'rash', label: 'Ruam', placeholder: 'Tidak ada' },
            { key: 'lumps', label: 'Benjolan', placeholder: 'Tidak ada' },
            { key: 'wound', label: 'Luka', placeholder: 'Tidak ada' },
            { key: 'infection', label: 'Infeksi', placeholder: 'Tidak ada tanda infeksi' },
        ],
    },
    jantung: {
        title: 'Pemeriksaan Fisik Dokter Jantung',
        fields: [
            { key: 'blood_pressure', label: 'Tekanan Darah', placeholder: '120/80 mmHg' },
            { key: 'pulse', label: 'Nadi', placeholder: '80 x/menit' },
            { key: 'heart_sound', label: 'Suara Jantung', placeholder: 'S1/S2 reguler' },
            { key: 'leg_swelling', label: 'Pembengkakan Tungkai', placeholder: 'Tidak ada' },
            { key: 'peripheral_pulse', label: 'Denyut Nadi Perifer', placeholder: 'Teraba kuat' },
            { key: 'neck_vein', label: 'Vena Leher', placeholder: 'Tidak meningkat' },
            { key: 'heart_failure_signs', label: 'Tanda Gagal Jantung', placeholder: 'Tidak ada' },
        ],
    },
    saraf: {
        title: 'Pemeriksaan Fisik Dokter Saraf',
        fields: [
            { key: 'consciousness', label: 'Kesadaran', placeholder: 'Compos Mentis' },
            { key: 'cranial_nerves', label: 'Saraf Kranial', placeholder: 'Dalam batas normal' },
            { key: 'muscle_strength', label: 'Kekuatan Otot', placeholder: '5/5' },
            { key: 'reflexes', label: 'Refleks', placeholder: 'Normal' },
            { key: 'sensory', label: 'Sensorik', placeholder: 'Normal' },
            { key: 'coordination', label: 'Koordinasi', placeholder: 'Baik' },
            { key: 'balance', label: 'Keseimbangan', placeholder: 'Baik' },
            { key: 'gait', label: 'Gaya Berjalan', placeholder: 'Normal' },
        ],
    },
    tulang: {
        title: 'Pemeriksaan Fisik Dokter Tulang',
        fields: [
            { key: 'bone_joint_shape', label: 'Bentuk Tulang dan Sendi', placeholder: 'Tidak ada deformitas' },
            { key: 'joint_range_of_motion', label: 'Rentang Gerak Sendi', placeholder: 'Normal' },
            { key: 'muscle_strength', label: 'Kekuatan Otot', placeholder: '5/5' },
            { key: 'tenderness', label: 'Nyeri Tekan', placeholder: 'Tidak ada' },
            { key: 'joint_stability', label: 'Stabilitas Sendi', placeholder: 'Stabil' },
            { key: 'posture', label: 'Postur Tubuh', placeholder: 'Normal' },
            { key: 'gait', label: 'Cara Berjalan', placeholder: 'Normal' },
        ],
    },
};

const specialistAliases: Array<[RegExp, keyof typeof specialistConfigs]> = [
    [/anak|pediatr/i, 'anak'],
    [/mata|oftal|ophthal/i, 'mata'],
    [/gigi|dental/i, 'gigi'],
    [/tht|telinga|hidung|tenggorokan|ent/i, 'tht'],
    [/kulit|derma/i, 'kulit'],
    [/jantung|kardio|cardio/i, 'jantung'],
    [/saraf|neurolog/i, 'saraf'],
    [/tulang|ortopedi|orthop/i, 'tulang'],
    [/umum|general/i, 'umum'],
];

function normalizeSpecialist(specialist?: string | null): keyof typeof specialistConfigs {
    const value = specialist?.trim() ?? '';
    const matched = specialistAliases.find(([pattern]) => pattern.test(value));

    return matched?.[1] ?? 'umum';
}

export function getPhysicalExamSections(specialist?: string | null): PhysicalExamSection[] {
    const config = specialistConfigs[normalizeSpecialist(specialist)];

    return [
        {
            title: config.title,
            fields: config.fields,
        },
        {
            title: 'Catatan Pemeriksaan Lain',
            fields: [additionalNotesField],
        },
    ];
}

function getFlatFields(specialist?: string | null): PhysicalExamField[] {
    return getPhysicalExamSections(specialist).flatMap((section) => section.fields);
}

export function createEmptyPhysicalExamFields(specialist?: string | null): PhysicalExamFields {
    return getFlatFields(specialist).reduce(
        (fields, field) => ({
            ...fields,
            [field.key]: '',
        }),
        {} as PhysicalExamFields
    );
}

export function buildPhysicalExamination(
    fields: PhysicalExamFields,
    specialist?: string | null
): string {
    return getFlatFields(specialist)
        .map((field) => {
            const value = (fields[field.key] ?? '').trim();

            return value ? `${field.label}: ${value}` : null;
        })
        .filter(Boolean)
        .join('\n');
}

export function parsePhysicalExamination(
    value?: string | null,
    specialist?: string | null
): PhysicalExamFields {
    const fields = createEmptyPhysicalExamFields(specialist);
    const labelToKey = new Map(
        getFlatFields(specialist).map((field) => [field.label.toLowerCase(), field.key])
    );
    const fallbackLines: string[] = [];

    if (!value?.trim()) {
        return fields;
    }

    value.split(/\r?\n/).forEach((line) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
            return;
        }

        const separatorIndex = trimmedLine.indexOf(':');

        if (separatorIndex === -1) {
            fallbackLines.push(trimmedLine);
            return;
        }

        const label = trimmedLine.slice(0, separatorIndex).trim().toLowerCase();
        const fieldKey = labelToKey.get(label);
        const fieldValue = trimmedLine.slice(separatorIndex + 1).trim();

        if (fieldKey) {
            fields[fieldKey] = fieldValue;
        } else {
            fallbackLines.push(trimmedLine);
        }
    });

    if (fallbackLines.length > 0) {
        fields.additional_notes = [
            fields.additional_notes,
            fallbackLines.join('\n'),
        ].filter(Boolean).join('\n');
    }

    return fields;
}
