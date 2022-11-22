<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Frutas;
use App\Models\Planilhas;



class TableController extends Controller
{
    public function file(Request $request)
    {
        $connection = pg_connect("host=localhost port=5432 dbname=db user=postgres password=@Nipponsat13@")  or
    die("Não foi possível conectar ao servidor PostGreSQL");

        for ($i = 0; $i < count($request->dados1) || $i < count($request->dados2); $i++) {
            $item1 = $request->dados1[$i];
            // echo 'Item1:' . $item1 . ' ' . 'index1:' . $i . ' ';
            
            $item2 = $request->dados2[$i];
            // echo 'Item2:' . $item2 . ' ' . 'index2:' . $i . ' ';

            $res = pg_query($connection, "INSERT INTO planilha VALUES ($item1, $item2);");
        };

        if ($res) {
            return response()->json([
                "message" => "Dados arquivados com sucesso"
            ]);
        }
        else {
            return response()->json([
                "message" => "O usuário deve ter inserido entradas inválidas"
            ]);
        }
    }

    public function deleteFile()
    {
        $connection = pg_connect("host=localhost port=5432 dbname=db user=postgres password=@Nipponsat13@")  or
    die("Não foi possível conectar ao servidor PostGreSQL");

        $res = pg_query($connection, "DELETE FROM planilha;");
        

        if ($res) {
            return response()->json([
                "message" => "Tabela limpa com sucesso"
            ]);
        }
        else {
            return response()->json([
                "message" => "Tabela NÃO foi limpa com sucesso"
            ]);
        }
    }


    public function getAll()
    {
        return Planilhas::all();
    }


    public function backup()
    {
        $connection = pg_connect("host=localhost port=5432 dbname=db user=postgres password=@Nipponsat13@")  or
            die("Não foi possível conectar ao servidor PostGreSQL");

        //Pega a data e hora Fusohorario Sao paulo -3
        date_default_timezone_set('America/Sao_Paulo');
        $DateAndTime = date('d-m-Y');

        pg_query($connection, "COPY frutas TO '/home/all/backup/PSQL-$DateAndTime.csv' CSV HEADER;");
        

        return response()->json([
            "message" => "Seu backup foi feito com sucesso em: (/home/all/backup/PSQL-$DateAndTime.csv)"
        ]);
    }
}
