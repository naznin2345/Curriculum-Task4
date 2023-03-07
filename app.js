const express = require("express");
const app = express();
var pdf = require("html-pdf");
var options = {
    format: "A3",
    margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
    },


   



};
app.use(express.json());
app.use(express.urlencoded());

const html = (Data) => {
    const filteredData = Data.filter((d) => d.Distributed).sort(
        (a, b) => a.Semester - b.Semester
    );
    const totalTable = [];
    for (let i = 0; i < Math.ceil(Data.length / 20); i++) {
        totalTable.push(i);
    }

    totalDistributedCourseTable = [];
    for (let d2 = 0; d2 < Math.ceil(filteredData.length / 20); d2++) {
        totalDistributedCourseTable.push(d2);
    }

    const totalSemester = [];
    filteredData.map((d) => {
        if (!totalSemester.map((s) => s.Semester).includes(d.Semester)) {
            totalSemester.push(d);
        }
    });

    return `
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>DemoPdf</title>
        <style>
        table {
            width: 90%;
            table-layout: fixed;
            position: relative;
            overflow: hidden;
            display: block;
           
        }
        body {
            Margin: 0 !important;
            padding: 10px;
            background-color: #FFF;
            font-family: Angsana New;
        }
        td {
            border-color: rgb(27, 26, 26);
            border-width: 0.1em;
            text-align: center;
            vertical-align: middle;
            overflow: auto;
            padding: 2px;
        }
        p {
            text-align: center;
            margin-bottom: 5px;
            
            padding: 2px;
            letter-spacing: normal;
            font-weight: bold;
        }

        


        </style>
    </head>
        <body>
        <div style="page-break-after:always">
<br><br><br>
<h3 style="text-align:center">Department of Computer Science and Engineering</h3>
<h4 style="color:rgb(144, 144, 151);text-align:center;">
Faculty of Modern Science
</h4><br>
 <center>
 <img src="https://upload.wikimedia.org/wikipedia/en/0/02/Leading_University_Logo.png" alt=" Logo" />
</center><br>
<p style="text-align:center;font-size: 15px;">
Program :&nbsp M.Sc in Computer Science and Engineering
</p>
<p style="text-align:center;font-size: 15px;">
 Name:&nbsp M.Sc in CSE(Curriculum 2022)</p>
<p style="text-align:center;font-size: 15px;">ID:&nbsp06121032</p>
 <p style="text-align:center;font-size: 15px;"> Minimum Credits to gain Degree:&nbsp20</p>
<p style="text-align:center;font-size: 15px;">Total Courses:&nbsp7</p>
<p style="text-align:center;font-size: 15px;">Distributed Courses:&nbsp7</p>
<p style="text-align:center;font-size: 15px;">Total Credits:&nbsp20</p>
<p style="text-align:center;font-size: 15px;">Distributed Credit:&nbsp20</p>
</div>

<div>
        <h3 style="text-align: center">List Of Courses</h3>

        ${totalTable
            .map(
                (value, index) =>
                    `
                   
                    <table style="page-break-after:always" border="1" align="center" cellspacing="0">
                    </br>
                    <thead>

        
                <tr>
                    <th>SI.No</td>
                    <th>Course Code</td>
                    <th>Course Title </td>
                    <th>Credits of course</td>
                </tr>
            </thead>
            <tbody>
                ${Data.splice(0, 20)
                    .map(
                        (d, i) =>
                            `
                        <tr>
                            <td>${i + 1 + 20 * index}</td>
                            <td>${d.CourseCode}</td>
                            <td>${d.CourseTitle}</td>
                            <td>${d.Credit}</td>

                        </tr>
                        `
                    )
                    .toString()
                    .split(",")
                    .join("")}
            </tbody>
           
        </table></br>

        `
            ).toString()
            .split(",")
            .join("")
            }

            
            <h3 style="text-align: center">Semester Wise Courses</h3>

            ${totalDistributedCourseTable
                .map((d1) => {
                    const semesterWiseCourse = filteredData.splice(0, 20);

                    return `
                    
                    <div style="page-break-inside:avoid">
                    <table  border="1" align="center" cellspacing="0" >
                    </br>

                <thead>
                <tr>
                    <th>Semester</th>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>credit</th>
                </tr>
                </thead>

                <tbody>
                    ${totalSemester
                        .map((d2) => d2.Semester)
                        .sort()
                        .map(
                            (d2) =>
                                `
${
    semesterWiseCourse.filter((d3) => d3.Semester === d2).length !== 0
        ? `
                                <tr>
                                    <td rowSpan="${
                                        semesterWiseCourse.filter(
                                            (d3) => d3.Semester === d2
                                        ).length + 1
                                    }">${d2}</td>

                                    ${semesterWiseCourse
                                        .filter((d3) => d3.Semester === d2)
                                        .map(
                                            (d3) =>
                                                `
                                            <tr>
                                                <td>${d3.CourseCode}</td>
                                                <td>${d3.CourseTitle}</td>
                                                <td>${d3.Credit}</td>
                                            </tr>

                                        `
                                        )}

                                </tr>
                                `
        : ""
}

                        `
                        )}



                        
                </tbody>
               
                </table>
                </br>
                </div>
                
                </body>
                ` ;
                }).toString()
                .split(",")
                .join("")}
                
               

                    </html>
       `; 
};

app.post("/", async (req, res) => {
    pdf.create(html(req.body), options).toFile(
        "./Curriculum.pdf",
        (err, result) => {
            if (err) {
                res.status(404).json({ message: "Failed" });
            } else {
                res.status(200).json({ message: "Successfully created" });
            }
        }
    );
});

app.listen(3030, () => {
    console.log("Server started");
});

