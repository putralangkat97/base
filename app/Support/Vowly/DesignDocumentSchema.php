<?php

namespace App\Support\Vowly;

use InvalidArgumentException;

final class DesignDocumentSchema
{
    public const int VERSION = 1;

    /**
     * Return the valid empty Design document.
     *
     * @return array<string, mixed>
     */
    public static function empty(): array
    {
        return [
            'schemaVersion' => self::VERSION,
            'responsive' => [
                'mode' => 'single-document',
                'breakpoints' => ['mobile', 'tablet', 'desktop'],
            ],
            'sections' => [],
        ];
    }

    /**
     * Validate a Design document and return path-keyed messages.
     *
     * @return array<string, list<string>>
     */
    public static function validate(mixed $document): array
    {
        if (! is_array($document)) {
            return ['document' => ['The document must be an object.']];
        }

        $errors = [];
        $ids = [];

        self::keys($document, ['schemaVersion', 'responsive', 'sections'], 'document', $errors);

        if (($document['schemaVersion'] ?? null) !== self::VERSION) {
            self::error($errors, 'document.schemaVersion', 'The document schema version is unsupported.');
        }

        self::validateResponsive($document['responsive'] ?? null, $errors);
        self::validateList($document['sections'] ?? null, 'document.sections', $errors, function (mixed $section, string $path) use (&$errors, &$ids): void {
            self::validateSection($section, $path, $errors, $ids);
        });

        return $errors;
    }

    /**
     * Assert that a Design document is valid and return its normalized array.
     *
     * @return array<string, mixed>
     */
    public static function assertValid(mixed $document): array
    {
        $errors = self::validate($document);

        if ($errors !== []) {
            throw new InvalidArgumentException(implode(' ', array_merge(...array_values($errors))));
        }

        /** @var array<string, mixed> $document */
        return $document;
    }

    /**
     * Validate the responsive document settings.
     *
     * @param  array<string, list<string>>  $errors
     */
    private static function validateResponsive(mixed $responsive, array &$errors): void
    {
        if (! is_array($responsive)) {
            self::error($errors, 'document.responsive', 'Responsive settings must be an object.');

            return;
        }

        self::keys($responsive, ['mode', 'breakpoints'], 'document.responsive', $errors);
        self::enum($responsive['mode'] ?? null, ['single-document'], 'document.responsive.mode', $errors);

        if (($responsive['breakpoints'] ?? null) !== ['mobile', 'tablet', 'desktop']) {
            self::error($errors, 'document.responsive.breakpoints', 'Responsive breakpoints must be mobile, tablet, and desktop.');
        }
    }

    /**
     * Validate a Section node.
     *
     * @param  array<string, list<string>>  $errors
     * @param  array<string, string>  $ids
     */
    private static function validateSection(mixed $section, string $path, array &$errors, array &$ids): void
    {
        if (! is_array($section)) {
            self::error($errors, $path, 'Each Section must be an object.');

            return;
        }

        self::keys($section, ['id', 'type', 'label', 'containers'], $path, $errors);
        self::id($section['id'] ?? null, $path.'.id', $errors, $ids);
        self::enum($section['type'] ?? null, ['section'], $path.'.type', $errors);
        self::string($section['label'] ?? null, $path.'.label', 120, $errors);
        self::validateList($section['containers'] ?? null, $path.'.containers', $errors, function (mixed $container, string $containerPath) use (&$errors, &$ids): void {
            self::validateContainer($container, $containerPath, $errors, $ids);
        });
    }

    /**
     * Validate a Container and its Grid and block children.
     *
     * @param  array<string, list<string>>  $errors
     * @param  array<string, string>  $ids
     */
    private static function validateContainer(mixed $container, string $path, array &$errors, array &$ids): void
    {
        if (! is_array($container)) {
            self::error($errors, $path, 'Each Container must be an object.');

            return;
        }

        self::keys($container, ['id', 'type', 'label', 'grid', 'blocks'], $path, $errors);
        self::id($container['id'] ?? null, $path.'.id', $errors, $ids);
        self::enum($container['type'] ?? null, ['container'], $path.'.type', $errors);
        self::string($container['label'] ?? null, $path.'.label', 120, $errors);
        self::validateGrid($container['grid'] ?? null, $path.'.grid', $errors, $ids);
        self::validateList($container['blocks'] ?? null, $path.'.blocks', $errors, function (mixed $block, string $blockPath) use (&$errors, &$ids): void {
            self::validateBlock($block, $blockPath, $errors, $ids);
        });
    }

    /**
     * Validate a Grid node.
     *
     * @param  array<string, list<string>>  $errors
     * @param  array<string, string>  $ids
     */
    private static function validateGrid(mixed $grid, string $path, array &$errors, array &$ids): void
    {
        if (! is_array($grid)) {
            self::error($errors, $path, 'Each Container must include one Grid.');

            return;
        }

        $allowedKeys = ['id', 'type', 'columns', 'gap', 'stackAt'];
        if (array_key_exists('layout', $grid)) {
            $allowedKeys[] = 'layout';
        }

        self::keys($grid, $allowedKeys, $path, $errors);
        self::id($grid['id'] ?? null, $path.'.id', $errors, $ids);
        self::enum($grid['type'] ?? null, ['grid'], $path.'.type', $errors);

        if (array_key_exists('layout', $grid)) {
            self::enum($grid['layout'], ['stack', 'grid'], $path.'.layout', $errors);
        }

        if (! is_int($grid['columns'] ?? null) || ! in_array($grid['columns'], [1, 2, 3], true)) {
            self::error($errors, $path.'.columns', 'Grid columns must be 1, 2, or 3.');
        }

        self::enum($grid['gap'] ?? null, ['sm', 'md', 'lg'], $path.'.gap', $errors);
        self::enum($grid['stackAt'] ?? null, ['mobile', 'tablet'], $path.'.stackAt', $errors);
    }

    /**
     * Validate a supported Content block.
     *
     * @param  array<string, list<string>>  $errors
     * @param  array<string, string>  $ids
     */
    private static function validateBlock(mixed $block, string $path, array &$errors, array &$ids): void
    {
        if (! is_array($block)) {
            self::error($errors, $path, 'Each Content block must be an object.');

            return;
        }

        $type = $block['type'] ?? null;

        if ($type === 'text') {
            self::keys($block, ['id', 'type', 'label', 'content', 'align'], $path, $errors);
            self::id($block['id'] ?? null, $path.'.id', $errors, $ids);
            self::string($block['label'] ?? null, $path.'.label', 120, $errors);
            self::string($block['content'] ?? null, $path.'.content', 10000, $errors);
            self::enum($block['align'] ?? null, ['left', 'center', 'right'], $path.'.align', $errors);

            return;
        }

        if ($type === 'image') {
            self::keys($block, ['id', 'type', 'label', 'mediaId', 'alt'], $path, $errors);
            self::id($block['id'] ?? null, $path.'.id', $errors, $ids);
            self::string($block['label'] ?? null, $path.'.label', 120, $errors);
            self::nullableString($block['mediaId'] ?? null, $path.'.mediaId', 160, $errors);
            self::string($block['alt'] ?? null, $path.'.alt', 240, $errors);

            return;
        }

        if ($type === 'button') {
            self::keys($block, ['id', 'type', 'label', 'text', 'href'], $path, $errors);
            self::id($block['id'] ?? null, $path.'.id', $errors, $ids);
            self::string($block['label'] ?? null, $path.'.label', 120, $errors);
            self::string($block['text'] ?? null, $path.'.text', 120, $errors);
            self::url($block['href'] ?? null, $path.'.href', $errors);

            return;
        }

        self::error($errors, $path.'.type', 'Only Text, Image, and Button blocks are supported.');
    }

    /**
     * Validate a list and each item.
     *
     * @param  array<string, list<string>>  $errors
     * @param  callable(mixed, string): void  $validateItem
     */
    private static function validateList(mixed $value, string $path, array &$errors, callable $validateItem): void
    {
        if (! is_array($value) || ! array_is_list($value)) {
            self::error($errors, $path, 'This value must be an ordered list.');

            return;
        }

        foreach ($value as $index => $item) {
            $validateItem($item, $path.'.'.$index);
        }
    }

    /**
     * Reject unknown and missing keys at a document node.
     *
     * @param  array<string, mixed>  $node
     * @param  list<string>  $allowed
     * @param  array<string, list<string>>  $errors
     */
    private static function keys(array $node, array $allowed, string $path, array &$errors): void
    {
        foreach (array_diff(array_keys($node), $allowed) as $key) {
            self::error($errors, $path.'.'.$key, 'This property is not supported.');
        }

        foreach (array_diff($allowed, array_keys($node)) as $key) {
            self::error($errors, $path.'.'.$key, 'This property is required.');
        }
    }

    /**
     * Validate and de-duplicate a stable node identifier.
     *
     * @param  array<string, list<string>>  $errors
     * @param  array<string, string>  $ids
     */
    private static function id(mixed $value, string $path, array &$errors, array &$ids): void
    {
        self::string($value, $path, 64, $errors);

        if (! is_string($value) || preg_match('/^[a-z][a-z0-9_-]{2,63}$/', $value) !== 1) {
            self::error($errors, $path, 'IDs must start with a lowercase letter and use only lowercase letters, numbers, underscores, or hyphens.');

            return;
        }

        if (isset($ids[$value])) {
            self::error($errors, $path, 'IDs must be unique within the document.');

            return;
        }

        $ids[$value] = $path;
    }

    /**
     * Validate a bounded string.
     *
     * @param  array<string, list<string>>  $errors
     */
    private static function string(mixed $value, string $path, int $max, array &$errors): void
    {
        if (! is_string($value) || trim($value) === '') {
            self::error($errors, $path, 'This value must be a non-empty string.');

            return;
        }

        if (mb_strlen($value) > $max) {
            self::error($errors, $path, "This value may not be longer than {$max} characters.");
        }
    }

    /**
     * Validate an optional bounded string.
     *
     * @param  array<string, list<string>>  $errors
     */
    private static function nullableString(mixed $value, string $path, int $max, array &$errors): void
    {
        if ($value === null) {
            return;
        }

        self::string($value, $path, $max, $errors);
    }

    /**
     * Validate an approved HTTP(S) destination.
     *
     * @param  array<string, list<string>>  $errors
     */
    private static function url(mixed $value, string $path, array &$errors): void
    {
        self::string($value, $path, 2048, $errors);

        if (! is_string($value)) {
            return;
        }

        $parts = parse_url($value);
        $scheme = is_array($parts) ? strtolower((string) ($parts['scheme'] ?? '')) : '';
        $host = is_array($parts) ? ($parts['host'] ?? null) : null;

        if (! in_array($scheme, ['http', 'https'], true) || ! is_string($host) || $host === '' || filter_var($value, FILTER_VALIDATE_URL) === false) {
            self::error($errors, $path, 'Button destinations must be valid HTTP or HTTPS URLs.');
        }
    }

    /**
     * Validate a string enum.
     *
     * @param  list<string>  $allowed
     * @param  array<string, list<string>>  $errors
     */
    private static function enum(mixed $value, array $allowed, string $path, array &$errors): void
    {
        if (! is_string($value) || ! in_array($value, $allowed, true)) {
            self::error($errors, $path, 'This value is not supported.');
        }
    }

    /**
     * Add a validation message.
     *
     * @param  array<string, list<string>>  $errors
     */
    private static function error(array &$errors, string $path, string $message): void
    {
        $errors[$path][] = $message;
    }
}
