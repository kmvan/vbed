<?php

namespace InnStudio\Vbed\Api;

include __DIR__ . '/../vendor/autoload.php';

include __DIR__ . '/Config.php';

class Entry
{
    use TraitAjaxCheckLogin;
    use TraitAjaxInit;
    use TraitAjaxSetOauth;
    use TraitAjaxUpload;

    const CONFIG_VERSION = '1.0.0';
    const TOKEN_EXPIRE   = 3600 * 24 * 29;

    public function __construct()
    {
        switch ($this->getAction()) {
            case 'init':
                $this->ajaxCheckReferer();
                $this->ajaxInit();

                break;
            case 'checkLogin':
                $this->ajaxCheckReferer();
                $this->ajaxCheckLogin();

                break;
            case 'setOauth':
                $this->ajaxSetOauth();

                break;
            case 'upload':
                $this->ajaxCheckReferer();
                $this->ajaxUpload();

                break;
            default:
        }
    }

    private function getTokenCookieId(): string
    {
        return \md5('vbed-cookie');
    }

    private function setTokenToCookie(string $token): void
    {
        \setcookie($this->getTokenCookieId(), \base64_encode($token), \time() + self::TOKEN_EXPIRE, '/', $_SERVER['HTTP_HOST'], Helper::isSsl(), true);
    }

    private function getTokenFromCookie(): string
    {
        $token = $_COOKIE[$this->getTokenCookieId()] ?? '';

        return $token ? \base64_decode($token) : '';
    }

    private function getAction(): string
    {
        return \filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING);
    }

    private function ajaxCheckReferer(): void
    {
        $referer  = $_SERVER['HTTP_REFERER'] ?? '';
        $hostname = \parse_url(Helper::getCurrentUrl(), PHP_URL_HOST);

        if (false === \strpos($referer, $hostname)) {
            \http_response_code(500);

            die;
        }
    }
}

new Entry();
