export enum NewsletterFormat {
    PORTRAIT = "PORTRAIT",
    LANDSCAPE = "LANDSCAPE",
}

export const NewsletterFormatLabel: Record<NewsletterFormat, string> = {
    [NewsletterFormat.PORTRAIT]: "Vertical",
    [NewsletterFormat.LANDSCAPE]: "Horizontal",
};
