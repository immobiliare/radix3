export const NODE_TYPES = {
    NORMAL: 0 as const,
    WILDCARD: 1 as const,
    PLACEHOLDER: 2 as const,
    CHECKED_PLACEHOLDER: 3 as const,
};

type _NODE_TYPES = typeof NODE_TYPES;
export type NODE_TYPE = _NODE_TYPES[keyof _NODE_TYPES];

type _RadixNodeDataObject = { params?: never; [key: string]: unknown };
export type RadixNodeData<
    T extends _RadixNodeDataObject = _RadixNodeDataObject
> = T;
export type MatchedRoute<T extends RadixNodeData = RadixNodeData> = Omit<
    T,
    'params'
> & { params?: Record<string, unknown> };

export interface RadixNode<T extends RadixNodeData = RadixNodeData> {
    type: NODE_TYPE;
    parent: RadixNode<T> | null;
    children: Map<string, RadixNode<T>>;
    data: RadixNodeData | null;
    paramName: string | null;
    wildcardChildNode: RadixNode<T> | null;
    placeholderChildNode: RadixNode<T> | null;
    placeholderChildrenNodeChecked: Array<RadixNode<T>>;
    check: (str: string) => boolean;
}

export interface RadixRouterOptions {
    strictTrailingSlash?: boolean;
    routes?: Record<string, unknown>;
    funcs?: Record<string, (str: string) => boolean>;
}

export interface RadixRouterContext<T extends RadixNodeData = RadixNodeData> {
    options: RadixRouterOptions;
    rootNode: RadixNode<T>;
    staticRoutesMap: Record<string, RadixNode>;
    funcs: Record<string, (str: string) => boolean>;
}

export interface RadixRouter<T extends RadixNodeData = RadixNodeData> {
    ctx: RadixRouterContext<T>;

    /**
     * Perform lookup of given path in radix tree
     * @param path - the path to search for
     *
     * @returns The data that was originally inserted into the tree
     */
    lookup(path: string): MatchedRoute<T> | null;

    /**
     * Perform an insert into the radix tree
     * @param path - the prefix to match
     * @param data - the associated data to path
     *
     */
    insert(path: string, data: T): void;

    /**
     * Perform a remove on the tree
     * @param { string } data.path - the route to match
     *
     * @returns A boolean signifying if the remove was successful or not
     */
    remove(path: string): boolean;
}
