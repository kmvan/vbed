<?php

namespace InnStudio\Vbed\Api;

trait TraitAjaxInit
{
    public function ajaxInit(): void
    {
        Helper::SessionStart();
        Helper::dieJson([
            'data' => [
                'csrf'       => Helper::createCsrf(),
                'isLoggedIn' => (bool) $this->getTokenFromCookie(),
                'oauthUrl'   => $this->getOauthUrl(),
            ],
        ]);
    }

    private function getOauthUrl()
    {
        $args = \http_build_query([
            'csrf'             => Helper::createCsrf(),
            'action'           => 'redirectToGetOaCode',
            'redirectToAppUrl' => URL . '/api/?action=setOauth',

        ]);

        return API_URL . '?' . $args;
    }
}
