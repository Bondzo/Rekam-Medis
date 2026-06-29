import {
    getPhysicalExamSections,
    PhysicalExamFields,
} from '@/lib/physical-examination';

type Props = {
    value: PhysicalExamFields;
    onChange: (field: keyof PhysicalExamFields, value: string) => void;
    specialist?: string | null;
    error?: string;
};

export default function PhysicalExaminationForm({
    value,
    onChange,
    specialist,
    error,
}: Props) {
    const physicalExamSections = getPhysicalExamSections(specialist);
    const sectionTitle = physicalExamSections[0]?.title ?? 'Physical Examination';

    return (
        <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-5">
                <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    {sectionTitle}
                </h2>
            </div>

            <div className="space-y-5">
                {physicalExamSections.map((section) => (
                    <div key={section.title} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {section.fields.map((field) => (
                                <label
                                    key={field.key}
                                    className={field.multiline ? 'md:col-span-2 xl:col-span-3' : ''}
                                >
                                    <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                        {field.label}
                                    </span>

                                    {field.multiline ? (
                                        <textarea
                                            value={value[field.key]}
                                            placeholder={field.placeholder}
                                            onChange={(event) => onChange(field.key, event.target.value)}
                                            className="min-h-28 w-full rounded-lg border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={value[field.key]}
                                            placeholder={field.placeholder}
                                            onChange={(event) => onChange(field.key, event.target.value)}
                                            className="w-full rounded-lg border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                        />
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-500">
                    {error}
                </p>
            )}
        </section>
    );
}
