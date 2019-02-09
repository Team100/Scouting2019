//
//  ViewController.swift
//  Scouting2019 Team 100
//
//  Created by Alexander Beaver on 2/3/19.
//  Copyright © 2019 Alexander Beaver. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    @IBOutlet weak var mainWebView: WKWebView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        let fbURL = URL(string: "https://scouting-2019-team-100.firebaseapp.com/")!
        let ur = URLRequest(url: fbURL)
        mainWebView.load(ur)
    }


}

