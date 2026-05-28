import { router } from "@inertiajs/react";

export type PaginationLink = {
    url: string | null;
    label: string;
    active?: boolean;
};

type SearchInputProps = {
    routeName: string;
    placeholder: string;
    value?: string;
    extraParams?: Record<string, string | undefined | null>;
};

export function SearchInput({
    routeName,
    placeholder,
    value,
    extraParams = {},
}: SearchInputProps) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            defaultValue={value ?? ""}
            onChange={(event) =>
                router.get(
                    routeName,
                    {
                        ...extraParams,
                        search: event.target.value,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    }
                )
            }
            className="rm-input w-full px-5 text-sm outline-none focus:border-[var(--rm-action)] focus:ring-1 focus:ring-[var(--rm-action)]"
        />
    );
}

export function Pagination({ links }: { links?: PaginationLink[] }) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="mt-5 flex flex-wrap gap-2">
            {links.map((link, index) => (
                <button
                    key={`${link.label}-${index}`}
                    disabled={!link.url}
                    onClick={() => {
                        if (link.url) {
                            router.visit(link.url, {
                                preserveState: true,
                                replace: true,
                            });
                        }
                    }}
                    className={`min-h-11 border px-4 text-sm font-bold uppercase tracking-[0.5px] transition disabled:cursor-not-allowed ${
                        link.active
                            ? "border-[var(--rm-action)] bg-transparent text-[var(--rm-action)]"
                            : "border-[var(--rm-hairline)] bg-transparent text-[var(--rm-ink)] hover:border-[var(--rm-action)] hover:text-[var(--rm-action)]"
                    }`}
                    dangerouslySetInnerHTML={{
                        __html: link.label,
                    }}
                />
            ))}
        </div>
    );
}
