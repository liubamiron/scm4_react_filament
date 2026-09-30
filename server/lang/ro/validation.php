<?php

// Сообщения валидации для APP_LOCALE=ro. Без этого файла Filament показывает
// сырые ключи вроде validation.min.string. Недостающие ключи берутся из
// fallback-локали (APP_FALLBACK_LOCALE).
return [
    'accepted' => 'Câmpul :attribute trebuie să fie acceptat.',
    'active_url' => 'Câmpul :attribute nu este un URL valid.',
    'after' => 'Câmpul :attribute trebuie să fie o dată după :date.',
    'after_or_equal' => 'Câmpul :attribute trebuie să fie o dată egală sau după :date.',
    'array' => 'Câmpul :attribute trebuie să fie o listă.',
    'before' => 'Câmpul :attribute trebuie să fie o dată înainte de :date.',
    'before_or_equal' => 'Câmpul :attribute trebuie să fie o dată egală sau înainte de :date.',
    'between' => [
        'array' => 'Câmpul :attribute trebuie să aibă între :min și :max elemente.',
        'file' => 'Fișierul :attribute trebuie să aibă între :min și :max kilobytes.',
        'numeric' => 'Câmpul :attribute trebuie să fie între :min și :max.',
        'string' => 'Câmpul :attribute trebuie să aibă între :min și :max caractere.',
    ],
    'boolean' => 'Câmpul :attribute trebuie să fie adevărat sau fals.',
    'confirmed' => 'Confirmarea câmpului :attribute nu se potrivește.',
    'current_password' => 'Parola este incorectă.',
    'date' => 'Câmpul :attribute nu este o dată validă.',
    'different' => 'Câmpurile :attribute și :other trebuie să fie diferite.',
    'email' => 'Câmpul :attribute trebuie să fie o adresă de e-mail validă.',
    'exists' => 'Valoarea selectată pentru :attribute nu este validă.',
    'file' => 'Câmpul :attribute trebuie să fie un fișier.',
    'image' => 'Câmpul :attribute trebuie să fie o imagine.',
    'in' => 'Valoarea selectată pentru :attribute nu este validă.',
    'integer' => 'Câmpul :attribute trebuie să fie un număr întreg.',
    'max' => [
        'array' => 'Câmpul :attribute nu poate avea mai mult de :max elemente.',
        'file' => 'Fișierul :attribute nu poate depăși :max kilobytes.',
        'numeric' => 'Câmpul :attribute nu poate fi mai mare de :max.',
        'string' => 'Câmpul :attribute nu poate avea mai mult de :max caractere.',
    ],
    'mimes' => 'Câmpul :attribute trebuie să fie un fișier de tipul: :values.',
    'min' => [
        'array' => 'Câmpul :attribute trebuie să aibă cel puțin :min elemente.',
        'file' => 'Fișierul :attribute trebuie să aibă cel puțin :min kilobytes.',
        'numeric' => 'Câmpul :attribute trebuie să fie cel puțin :min.',
        'string' => 'Câmpul :attribute trebuie să aibă cel puțin :min caractere.',
    ],
    'numeric' => 'Câmpul :attribute trebuie să fie un număr.',
    'password' => [
        'letters' => 'Câmpul :attribute trebuie să conțină cel puțin o literă.',
        'mixed' => 'Câmpul :attribute trebuie să conțină cel puțin o literă mare și una mică.',
        'numbers' => 'Câmpul :attribute trebuie să conțină cel puțin o cifră.',
        'symbols' => 'Câmpul :attribute trebuie să conțină cel puțin un simbol.',
        'uncompromised' => 'Parola :attribute a apărut într-o scurgere de date. Alegeți alta.',
    ],
    'regex' => 'Formatul câmpului :attribute nu este valid.',
    'required' => 'Câmpul :attribute este obligatoriu.',
    'same' => 'Câmpurile :attribute și :other trebuie să coincidă.',
    'size' => [
        'array' => 'Câmpul :attribute trebuie să aibă :size elemente.',
        'file' => 'Fișierul :attribute trebuie să aibă :size kilobytes.',
        'numeric' => 'Câmpul :attribute trebuie să fie :size.',
        'string' => 'Câmpul :attribute trebuie să aibă :size caractere.',
    ],
    'string' => 'Câmpul :attribute trebuie să fie text.',
    'unique' => 'Valoarea câmpului :attribute este deja folosită.',
    'uploaded' => 'Fișierul :attribute nu a putut fi încărcat.',
    'url' => 'Câmpul :attribute trebuie să fie un URL valid.',

    'attributes' => [],
];
