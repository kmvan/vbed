<?php

namespace InnStudio\Vbed\Api;

class Helper
{
    public static function getCurrentUrl(): string
    {
        return "//{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
    }

    public static function SessionStart(): void
    {
        if ( ! isset($_SESSION)) {
            \session_start();
        }
    }

    public static function dieCsrf($csrf = ''): void
    {
        $csrf = $csrf ?: \filter_input(INPUT_GET, 'csrf', FILTER_SANITIZE_STRING);

        if ( ! self::isValidCsrf($csrf)) {
            self::dieJson([
                'code' => -1,
                'msg'  => 'Sorry, operation timeout, please refresh page and retry.',
            ]);
        }
    }

    public static function isSsl(): bool
    {
        if (isset($_SERVER['HTTPS'])) {
            if ('on' === (string) \strtolower($_SERVER['HTTPS'])) {
                return true;
            }

            if ('1' === (string) $_SERVER['HTTPS']) {
                return true;
            }
        } elseif (isset($_SERVER['SERVER_PORT']) && (443 === (int) $_SERVER['SERVER_PORT'])) {
            return true;
        }

        return false;
    }

    public static function isValidCsrf(string $csrf): bool
    {
        $csrf = \filter_var($csrf, FILTER_SANITIZE_STRING);

        if ( ! $csrf) {
            return false;
        }

        self::SessionStart();

        return $csrf === $_SESSION['csrf'];
    }

    public static function genCsrf(): string
    {
        self::SessionStart();
        $csrf = $_SESSION['csrf'] ?? '';

        if ( ! $csrf) {
            $csrf             = self::getRandStr();
            $_SESSION['csrf'] = $csrf;
        }

        return $csrf;
    }

    public static function getRandStr($len = 16, $conf = []): string
    {
        $len = (int) $len ?: 16;

        $conf = \array_merge([
            'number'    => '1234567890',
            'lowerCase' => 'abcdefghijklmnopqrstuvwxyz',
            'upperCase' => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        ], $conf);

        $words = \implode('', (array) $conf);

        if ( ! $words) {
            return '';
        }

        $str      = '';
        $wordsLen = \mb_strlen($words);

        for ($i = 0; $i < $len; ++$i) {
            $str .= $words[\mt_rand(0, $wordsLen - 1)];
        }

        return $str;
    }

    public static function dieJson($data = []): void
    {
        \header('Content-Type: application/json');

        $data = \array_merge([
            'code' => 0,
            'msg'  => 'ok',
            'data' => (object) [],
        ], $data);

        die(\json_encode($data, JSON_UNESCAPED_UNICODE));
    }

    public static function getClientIp(): string
    {
        $keys = ['HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];

        foreach ($keys as $key) {
            if ( ! isset($_SERVER[$key])) {
                continue;
            }

            $ip = \array_filter(\explode(',', $_SERVER[$key]));
            $ip = \filter_var(\end($ip), FILTER_VALIDATE_IP);

            if ($ip) {
                return $ip;
            }
        }

        return '';
    }
}
