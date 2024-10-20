import 'dart:convert';

ChamberAssociation chamberAssociationFromJson(String str) => ChamberAssociation.fromJson(json.decode(str));

String chamberAssociationToJson(ChamberAssociation data) => json.encode(data.toJson());

class ChamberAssociation {
  final int associationID;
  final String associationStartDate;
  final String warrantyEndDate;
  final int chamberID;
  final int assignedID;

  ChamberAssociation({
    required this.associationID,
    required this.associationStartDate,
    required this.warrantyEndDate,
    required this.chamberID,
    required this.assignedID,
  });

  factory ChamberAssociation.fromJson(Map<String, dynamic> json) => ChamberAssociation(
        associationID: json["associationID"],
        associationStartDate: json["associationStartDate"],
        warrantyEndDate: json["warrantyEndDate"],
        chamberID: json["chamberID"],
        assignedID: json["assignedID"],
      );

  Map<String, dynamic> toJson() => {
        "associationID": associationID,
        "associationStartDate": associationStartDate,
        "warrantyEndDate": warrantyEndDate,
        "chamberID": chamberID,
        "assignedID": assignedID,
      };
}
