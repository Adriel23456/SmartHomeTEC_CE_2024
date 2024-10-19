import 'dart:convert';

UsageLog usageLogFromJson(String str) => UsageLog.fromJson(json.decode(str));

String usageLogToJson(UsageLog data) => json.encode(data.toJson());

class UsageLog {
    final int? logId;
    final String startDate;
    final String startTime;
    final String? endDate;
    final String? endTime;
    final String? totalHours;
    final String clientEmail;
    final int assignedId;

    UsageLog({
        this.logId,
        required this.startDate,
        required this.startTime,
        this.endDate,
        this.endTime,
        this.totalHours,
        required this.clientEmail,
        required this.assignedId,
    });

    factory UsageLog.fromJson(Map<String, dynamic> json) => UsageLog(
        logId: json["logID"],
        startDate: json["startDate"],
        startTime: json["startTime"],
        endDate: json["endDate"],
        endTime: json["endTime"],
        totalHours: json["totalHours"],
        clientEmail: json["clientEmail"],
        assignedId: json["assignedID"],
    );

    Map<String, dynamic> toJson() => {
        "logID": logId,
        "startDate": startDate,
        "startTime": startTime,
        "endDate": endDate,
        "endTime": endTime,
        "totalHours": totalHours,
        "clientEmail": clientEmail,
        "assignedID": assignedId,
    };
}
