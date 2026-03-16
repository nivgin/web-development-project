export interface ChefAIFilters {
    category: string | null;
    time: number | null;
    ingredientsInclude: string[] | null;
    ingredientsExclude: string[] | null;
    servings: number | null;
    keywords: string[] | null;
}

export interface RegexCondition {
    $regex: string;
    $options: "i";
}

export interface NotRegexCondition {
    $not: RegExp;
}

export type ContentCondition = RegexCondition | NotRegexCondition;

export interface PostMatchQuery {
    title?: RegexCondition;
    time?: { $lte: number };
    category?: RegexCondition;
    content?: ContentCondition;
    ingredients?: {
        $elemMatch: RegexCondition;
    } | NotRegexCondition;
    $and?: Array<{
        ingredients?: { $elemMatch: RegexCondition } | NotRegexCondition;
        content?: ContentCondition;
    }>;
    sender?: string;
}