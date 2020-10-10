<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Picture;
use Auth;

class PicturesController extends Controller
{
    public function uploadFilePost(Request $request)
    {
      $file = $request->file('post');

      //Display File Name
      $name = $file->getClientOriginalName();

      //Display UID File
      $uid = $request['dataFile'];

      //Folder
      $folder = $request['folder'];

      //Display File Extension
      $extension = $file->getClientOriginalExtension();

      //Display File Real Path
      $real_path = $file->getRealPath();

      //Display File Size
      $size = $file->getSize();

      //Display File Mime Type
      $mine_type = $file->getMimeType();

      //Right image
      $image = $uid.".".$extension;

      //Move Uploaded File
      $destinationPath = public_path('images').$folder;
      $file->move($destinationPath, $image);

      //URL image
      $url = "/images".$folder."/".$image;

      //DB
      $saveDB = $this->saveFilePostDB($image, $uid, $url);

      return $saveDB;
    }

    public function deleteFilePost(Request $request)
    {
      // return $request;
      if (!empty($request['file']['response']['id'])) {
        $destinationPath = public_path('images').$request['folder'];
        $image_delete = $destinationPath."/".$request['file']['response']['name'];
        if (file_exists($destinationPath."/".$request['file']['response']['name'])) {
          unlink($image_delete);
        }

        $delete = Picture::find($request['file']['response']['id']);
        $delete->status_id = 3;
        $delete->save();

        return $delete;
      } else {
        return response()->json(['error' => 'Pircture ID not Found']);
      }

    }

    private function saveFilePostDB($name, $uid, $url)
    {
      return Picture::create([
        'name' => $name,
        'slug' => $uid,
        'url' => $url,
        'status_id' => 1,
      ]);
    }
}
